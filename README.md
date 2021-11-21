# CLI script for quick uploading (and deleting) of a file via SCP

## Installing

- Clone or download the repo.
- `npm i && npm run build`
- Install globally so you can use it anywhere: `npm install -g ./`

---

## Configuring

- `cp .env.example.json .env.json`
- Edit the variables to your liking (see below).

### Example configuration:

```
{
  "sshKeyPath": "~/.ssh/id_rsa.pub",
  "uploadDirPath": "/var/www/temp/",
  "sshUsername": "username",
  "remoteDomain": "example.com",
  "remoteSchema": "https"
}
```

**Note:** `sshKeyPath` can be omitted and the script will let SCP search for your default key.

---

## Uploading a file

- Navigate to a directory with the file you want to upload.
- `upload <FILENAME>`

---

## Deleting a file

- `upload <FILENAME> -d`
