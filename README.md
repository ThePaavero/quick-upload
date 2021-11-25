# CLI script for uploading, deleting and listing files via SCP

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

Example output:

```
🔼 Uploading...
✅ Success.
Here's your link:
https://example.com/temp/example.txt
```

---

## Deleting a file

- `upload <FILENAME> -d`

Example output:

```
✅ The file /var/www/temp/example.txt has been removed.
```

---

## Uploading a temporary file

- `upload <FILENAME> -t`
- Click the link, download the file.

This will wait for you to hit any key (except for Enter, for some reason) and then delete file.

Example output:

```
🔼 Uploading...
✅ Success.
Here's your link:
https://example.com/temp/example.txt
Download the file and then press ENTER to delete it.
```

After key press:

```
✅ The file /var/www/temp/example.txt has been removed.
```

---

## Listing uploaded files

- `upload -l`

Example output:

```
📑 Running "ls -la" on upload directory...
Response:
total 12
drwxr-xr-x  2 root root 4096 Nov 25 20:46 .
drwxr-xr-x 25 root root 4096 Nov 19 09:46 ..
-rwxr-xr-x  1 root root 1404 Nov 25 20:46 example.txt
```
