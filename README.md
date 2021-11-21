# Quick uploading (via SCP) CLI script

## Installing

- Clone or download the repo.
- `npm i`
- `npm run build`
- Install globally so you can use it anywhere: `npm install -g ./`

## Configuring

- `cp .env.example.json .env.json`
- Edit the variables to your liking.

### Example configuration:

```
{
  "sshKeyPath": "~/.ssh/id_rsa.pub",
  "uploadDirPath": "/var/www/temp/",
  "sshUsername": "yourusername",
  "remoteDomain": "example.com",
  "remoteSchema": "https"
}
```

## Uploading a file

- Navigate to a directory with the file you want to upload.
- `upload <FILENAME>`

## Deleting a file

- `upload <FILENAME> -d`
