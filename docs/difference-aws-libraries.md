# Difference between client-s3 and lib-storage

`@aws-sdk/client-s3`:

- Works fine for smaller files
- But large files can cause issues (e.g., memory consumption, timeout, or failure due to S3 limitations on size)
- You may need to manage multipart uploads manually

`@aws-sdk/lib-storage`:

- Specifically designed for large files
- It automatically handles multipart uploads, retries, and error handling, making it much more efficient for big files
