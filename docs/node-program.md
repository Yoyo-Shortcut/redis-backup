# Docs

- [Main Doc](../README.md)

# Run

```sh
pnpm build
pnpm start
```

# Configuration

- `AWS_ACCESS_KEY_ID`: AWS access key ID

  - Required
  - Obtained from AWS IAM user

- `AWS_SECRET_ACCESS_KEY`: AWS secret access key, sometimes also called an application key

  - Required
  - Obtained from AWS IAM user

- `AWS_S3_REGION`: The name of the region your bucket is located in, set to `auto` if unknown

  - Required
  - Obtained from AWS S3 bucket

- `AWS_S3_BUCKET`: The name of the bucket that the access key ID and secret access key are authorized to access

  - Required
  - Obtained from AWS S3 bucket

- `AWS_S3_BUCKET_SUBFOLDER`: Define a subfolder to place the backup files in

  - Optional: Default = `""`

- `AWS_S3_ENDPOINT`: The S3 custom endpoint you want to use. Applicable for 3rd party S3 services such as Cloudflare R2 or Backblaze R2

  - Optional: Default = `""`

- `AWS_S3_FORCE_PATH_STYLE`: Use path style for the endpoint instead of the default subdomain style, useful for MinIO

  - Optional: Default = `"false"`

- `AWS_S3_SUPPORT_OBJECT_LOCK`: Enables support for buckets with object lock by providing an MD5 hash with the backup file

  - Optional: Default = `"false"`

- `BACKUP_DATABASE_URL`: The connection string of the Redis database to backup

  - Required
  - Obtained from Redis database settings

- `BACKUP_OPTIONS`: Add any valid `redis-cli` options

  - Optional: Default = `""`

- `BACKUP_CRON_SCHEDULE`: The cron schedule to run the backup on

  - Optional: Default = `"0 5 * * *"`

- `BACKUP_FILE_PREFIX`: Add a prefix to the file name

  - Optional: Default = `"backup"`

- `RUN_ON_STARTUP`: Run a backup on startup of this application then proceed with making backups on the set schedule

  - Optional: Default = `"false"`

- `SINGLE_SHOT_MODE`: Run a single backup on start and exit when completed. Useful with the platform's native CRON scheduler

  - Optional: Default = `"false"`
