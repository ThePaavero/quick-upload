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
- `upload <FILENAME>` (tab-autocomplete will work)

---

## Deleting a file

- `upload <FILENAME> -d`

---

## Uploading a temporary file

- `upload <FILENAME> -t`
- Click the link, download the file.

This will wait for you to hit any key (except for Enter, for some reason) and then delete file.
