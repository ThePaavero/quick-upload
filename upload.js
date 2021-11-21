#!/usr/bin/node
const { execSync } = require('child_process')
const fs = require('fs')
const { argv } = require('process')
const config = require('./.env.json')

const workingDir = process.cwd()
const filename = argv[2].trim()
const sourcePath = `${workingDir}/${filename}`
const command = `scp -i ${config.sshKeyPath} ${sourcePath} ${config.sshUsername}@${config.remoteDomain}:${config.uploadDirPath}`

const response = execSync(command).toString()

console.log(response)
