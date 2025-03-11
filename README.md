# redis-backup

Redis backup server to deploy on Railway

Rewritten from https://github.com/ductienthan/redis-backup

- Based on https://github.com/railwayapp-templates/postgres-s3-backups
- Postgres S3 blog: https://blog.railway.com/p/postgre-backup
- Automated Postgres S3 blog: https://blog.railway.com/p/automated-postgresql-backups

Research links:

- https://redis.io/docs/latest/operate/oss_and_stack/management/replication/
- https://stackoverflow.com/questions/68124389/redis-error-condition-on-socket-for-sync-connection-refused
- https://www.codeleading.com/article/52024828196/
- https://stackoverflow.com/questions/25416007/what-does-the-bind-parameter-do-in-redis
- https://stackoverflow.com/questions/37402551/what-is-the-location-of-redis-conf-in-official-docker-image

# Tech

- `redis-cli`: For generating rdb and importing back into a Redis instance
- `Node.js`: For mini server
- `Docker`: For containerizing the whole environment, making it easier to deploy

# Overall idea

We have 2 Redis instances:

1. Remote: The main Redis instance we want to backup (The one on our production server)
2. Local: The temporary Redis instance that will help us during `recovering` process

There are 2 actions we want to perform:

1. Backup: Retrieve a `dump.rdb` file from our production Redis server
2. Restore: Push a `dump.rdb` file back into our production Redis server

Overview of procedures:

1. Backup: We simply use redis-cli to export a `dump.rdb` file from our production Redis server

2. Restore:

- We first need to put the backup `dump.rdb` file in our local Redis instance
- Then, we use Redis replication method to make our production Redis server replicate our local Redis instance
- The production server will automatically copy all the data from local Redis instance and thus recover the backup file

# Docs

- [Playground Redis](./docs/playground-redis.md): Play around with the Docker setup of 2 Redis instances, simulating local and remote situation

# Learning Resources

- [Difference between AWS libraries](./docs/difference-aws-libraries.md): Difference between `@aws-sdk/client-s3` and `@aws-sdk/lib-storage`
