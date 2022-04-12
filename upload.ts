#!/usr/bin/node

import { execSync } from 'child_process'
import { argv } from 'process'
import config from './.env.json'
import chalk from 'chalk'
import readlineSync from 'readline-sync'

interface ConfigObject {
  sshKeyPath?: string
  docRoot: string
  uploadDirPath: string
  sshUsername: string
  remoteDomain: string
  remoteSchema: string
}

const workingDir = process.cwd()
const filename = argv[2] ? argv[2].trim() : null

const showListOfUploadedFiles = (config: ConfigObject): void => {
  console.log(chalk.white(`📑 Running "ls -la" on upload directory...`))
  const response = execSync(`ssh ${config.sshUsername}@${config.remoteDomain} 'cd ${config.docRoot}${config.uploadDirPath} \n ls -la'`).toString()
  console.log(chalk.gray('Response:'))
  console.log(response)
}

const showHelp = (): void => {
  const pairSeparator = '\n'
  const flagSeparator = chalk.gray('\n---\n\n')
  const flagMap = {
    '<filename>': 'Uploads given file. Provides URL.',
    '<filename> -t': 'Uploads given file, waits for your to hit enter which will trigger deleting of the uploaded file. Provides URL.',
    '<filename> -d': `Deletes given file.`,
    '-l': 'Lists uploaded files.',
    '-n': 'Deletes all uploaded files ("n" for "nuke").',
    '-h': 'Shows this.',
  }
  console.log(
    `\n${chalk.bgWhite.black('Flags and their actions:')}\n\n${Object.entries(flagMap)
      .map((item, index) => {
        const flag = chalk.white('upload ') + chalk.green(`${item[0]}`)
        const text = chalk.white(`${item[1]}\n`)
        return `${flag}${pairSeparator}> ${text}${index < Object.keys(flagMap).length - 1 ? flagSeparator : ''}`
      })
      .join('')}`
  )
}

if (argv[2] === '-h' || !argv[2]) {
  showHelp()
  process.exit(0)
}

if (argv[2] === '-l') {
  showListOfUploadedFiles(config)
  process.exit(0)
}

if (!filename) {
  console.log(chalk.red('⛔ You need to give me a file name.'))
  process.exit(-1)
}

const getFilenameWithoutPath = (config: ConfigObject): string => {
  return `${config.docRoot}${config.uploadDirPath}${filename.replace(workingDir, '')}`
}

const filenameWithoutPath = getFilenameWithoutPath(config)

const getPossibleKeyFlag = (config: ConfigObject): string => {
  return !config.sshKeyPath ? '' : `-i ${config.sshKeyPath}`
}

const deleteFile = (config: ConfigObject): string | void => {
  try {
    execSync(`ssh ${config.sshUsername}@${config.remoteDomain} 'rm ${filenameWithoutPath}'`)
    return console.log(chalk.white(`✅ The file ${filenameWithoutPath} has been removed.`))
  } catch (error) {
    return console.log(chalk.bgRed.black(`⛔ The file ${filenameWithoutPath} could not be removed.\n\nHere's the error from remote:\n${error.toString()}`))
  }
}

const deleteFiles = (config: ConfigObject): string | void => {
  try {
    execSync(`ssh ${config.sshUsername}@${config.remoteDomain} 'rm -rf ${config.docRoot}${config.uploadDirPath}*'`)
    return console.log(chalk.white(`✅ All files have been removed.`))
  } catch (error) {
    return console.log(chalk.bgRed.black(`⛔ The files could not be removed.\n\nHere's the error from remote:\n${error.toString()}`))
  }
}

const uploadFile = (config: ConfigObject, waitAndDelete = false): string | void => {
  const sourcePath = `${workingDir}/${filename}`
  const command = `scp ${getPossibleKeyFlag(config)} ${sourcePath} ${config.sshUsername}@${config.remoteDomain}:${config.docRoot}${config.uploadDirPath}`

  try {
    console.log(chalk.gray('🔼 Uploading...'))
    execSync(command, { stdio: undefined })
    const url = `${config.remoteSchema}://${config.remoteDomain}/${config.uploadDirPath.replace(config.docRoot, '')}${filename.replace(workingDir, '')}`
    const messages = [chalk.green('✅ Success.'), chalk.white.bold(`Here's your link:`), chalk.bgWhite.black(url)]
    console.log(messages.join('\n'))
    if (waitAndDelete) {
      const deleteOutput = readlineSync.question('Download the file and then press ENTER to delete it.', { hideEchoBack: true, mask: '' })
      deleteFile(config)
      console.log(deleteOutput)
    }
  } catch (error) {
    return console.log(chalk.bgRed.black(`⛔ The file ${filenameWithoutPath} could not be uploaded.\nHere's the error message from remote:\n${error.toString()}`))
  }
}

if (argv[2] === '-n') {
  deleteFiles(config)
  process.exit(0)
}

if (!argv[3]) {
  uploadFile(config)
  process.exit(0)
}

const flag = argv[3].trim()
switch (flag) {
  case '-d':
    deleteFile(config)
    process.exit(0)
  case '-t':
    uploadFile(config, true)
    process.exit(0)
  default:
    console.log(chalk.bgRed.black(`⛔ Unknown flag "${flag}"`))
    process.exit(0)
}
