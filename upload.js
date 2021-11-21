#!/usr/bin/node
const { execSync } = require('child_process')
const fs = require('fs')
const { argv } = require('process')
const config = require('./.env.json')

const workingDir = process.cwd()
const filename = argv[2] ? argv[2].trim() : null

if (!filename) {
  console.log('You need to give me a file name.')
  process.exit(-1)
}

const getPossibleKeyFlag = () => {
  if (!config.sshKeyPath) {
    return ''
  }
  return `-i ${config.sshKeyPath}`
}

const sourcePath = `${workingDir}/${filename}`
const command = `scp ${getPossibleKeyFlag()} ${sourcePath} ${config.sshUsername}@${config.remoteDomain}:${config.uploadDirPath}`
const response = execSync(command).toString()

console.log(response)