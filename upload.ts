#!/usr/bin/node

import { execSync } from 'child_process'
import { argv } from 'process'
import config from './.env.json'
import chalk from 'chalk'

interface ConfigObject {
  sshKeyPath?: string
  uploadDirPath: string
  sshUsername: string
  remoteDomain: string
  remoteSchema: string
}

const workingDir = process.cwd()
const filename = argv[2] ? argv[2].trim() : null

if (!filename) {
  console.log(chalk.red('⛔ You need to give me a file name.'))
  process.exit(-1)
}

const getFilenameWithoutPath = (config: ConfigObject): string => {
  return `${config.uploadDirPath}${filename.replace(workingDir, '')}`
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
    return console.log(chalk.bgRed.black(`⛔ The file ${filenameWithoutPath} could not be removed.\n\nThe error from remote:\n\n${error.toString()}`))
  }
}

const uploadFile = (config: ConfigObject, waitAndDelete = false): string | void => {
  const sourcePath = `${workingDir}/${filename}`
  const command = `scp ${getPossibleKeyFlag(config)} ${sourcePath} ${config.sshUsername}@${config.remoteDomain}:${config.uploadDirPath}`

  try {
    console.log(chalk.gray('🔼 Uploading...'))
    execSync(command, { stdio: undefined })
    const url = `${config.remoteSchema}://${config.remoteDomain}${config.uploadDirPath.replace('/var/www', '')}${filename.replace(workingDir, '')}`
    const messages = [chalk.green('✅ Success.'), chalk.white.bold(`Here's your link:`), chalk.bgWhite.black(url)]
    console.log(messages.join('\n'))
    if (waitAndDelete) {
      // TODO: We need to do this with promises. Doesn't work yet.
      console.log(chalk.red('Temporary file functionality is not yet ready.'))
    }
  } catch (error) {
    return console.log(chalk.bgRed.black(`⛔ The file ${filenameWithoutPath} could not be uploaded.\nHere's the error message from remote:\n${error.toString()}`))
  }
}

if (argv[3] && argv[3] === '-d') {
  deleteFile(config)
  process.exit(0)
} else if (argv[3] && argv[3] === '-t') {
  uploadFile(config, true)
  process.exit(0)
} else if (argv[3]) {
  console.log(chalk.bgRed.black(`⛔ Unknown flag "${argv[3]}"`))
  process.exit(0)
}

uploadFile(config)
process.exit(0)
