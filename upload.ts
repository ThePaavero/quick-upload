#!/usr/bin/node

import { execSync } from 'child_process'
import { argv } from 'process'
import config from './.env.json'
import chalk from 'chalk'

interface ConfigObject {
  sshKeyPath?: string | undefined
  uploadDirPath: string
  sshUsername: string
  remoteDomain: string
  remoteSchema: string
}

const workingDir = process.cwd()
const filename = argv[2] ? argv[2].trim() : null

if (!filename) {
  console.log(chalk.red('You need to give me a file name.'))
  process.exit(-1)
}

const getFilenameWithoutPath = (config: ConfigObject) => {
  return `${config.uploadDirPath}${filename.replace(workingDir, '')}`
}

const getPossibleKeyFlag = (config: ConfigObject) => {
  if (!config.sshKeyPath) {
    return ''
  }
  return `-i ${config.sshKeyPath}`
}

const processPossibleDeleting = (config: ConfigObject) => {
  if (argv[3] && argv[3] === '-d') {
    try {
      execSync(`ssh ${config.sshUsername}@${config.remoteDomain} 'rm ${getFilenameWithoutPath(config)}'`)
      return console.log(chalk.greenBright(`The file ${getFilenameWithoutPath(config)} has been removed.`))
    } catch (error) {
      return console.log(chalk.bgRed.black(`ERR: The file ${getFilenameWithoutPath(config)} could not be removed.\n\nThe error from remote:\n\n${error.toString()}`))
    }
  }
}

const processPossibleUploading = (config: ConfigObject) => {
  const sourcePath = `${workingDir}/${filename}`
  const command = `scp ${getPossibleKeyFlag(config)} ${sourcePath} ${config.sshUsername}@${config.remoteDomain}:${config.uploadDirPath}`

  try {
    console.log(chalk.gray('Uploading...'))
    execSync(command, { stdio: undefined })
    const url = `${config.remoteSchema}://${config.remoteDomain}${config.uploadDirPath.replace('/var/www', '')}${filename.replace(workingDir, '')}`
    console.log(chalk.green('Success.'))
    console.log(chalk.white(`Here's your link:`))
    console.log(chalk.blueBright(url))
  } catch (error) {
    return console.log(chalk.bgRed.black(`ERR: The file ${getFilenameWithoutPath(config)} could not be uploaded.\nThe error from remote:\n${error.toString()}`))
  }
}

if (argv[3] && argv[3] === '-d') {
  processPossibleDeleting(config)
  process.exit(0)
}

processPossibleUploading(config)
process.exit(0)
