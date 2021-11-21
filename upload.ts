#!/usr/bin/node
const { execSync } = require('child_process')
const { argv } = require('process')
const config = require('./.env.json')

const workingDir = process.cwd()
const filename = argv[2] ? argv[2].trim() : null

if (!filename) {
  console.log('You need to give me a file name.')
  process.exit(-1)
}

const getFilenameWithoutPath = () => {
  return `${config.uploadDirPath}${filename.replace(workingDir, '')}`
}

const getPossibleKeyFlag = () => {
  if (!config.sshKeyPath) {
    return ''
  }
  return `-i ${config.sshKeyPath}`
}

if (argv[3] && argv[3] === '-d') {
  try {
    execSync(`ssh ${config.sshUsername}@${config.remoteDomain} 'rm ${getFilenameWithoutPath()}'`)
    return console.log(`The file ${getFilenameWithoutPath()} has been removed.`)
  } catch (error) {
    return console.log(`ERR: The file ${getFilenameWithoutPath()} could not be removed.\n\nThe error from remote:\n\n${error.toString()}`)
  }
}

const sourcePath = `${workingDir}/${filename}`
const command = `scp ${getPossibleKeyFlag()} ${sourcePath} ${config.sshUsername}@${config.remoteDomain}:${config.uploadDirPath}`

try {
  execSync(command)
  console.log(`Success. Here's your link:\n${config.remoteSchema}://${config.remoteDomain}${config.uploadDirPath.replace('/var/www', '')}${filename.replace(workingDir, '')}`)
} catch (error) {
  return console.log(`ERR: The file ${getFilenameWithoutPath()} could not be uploaded.\n\nThe error from remote:\n\n${error.toString()}`)
}

