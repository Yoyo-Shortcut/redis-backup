# redis-backup

Redis backup server to deploy on Railway

Rewritten from https://github.com/ductienthan/redis-backup

# Tech

- `redis-cli`: For generating rdb and importing back into a Redis instance
- `Node.js`: For mini server
- `Docker`: For containerizing the whole environment, making it easier to deploy

# Export remote snapshot to local

## 1. Take snapshot rdb

```zsh
redis-cli -u 'redis://<username>:<password>@<hostname>:<port>' --rdb your_backup.rdb
```

**Example using test-redis Docker container**

NOTE: Redis does not have username by default

```zsh
redis-cli -u 'redis://:yoyo@127.0.0.1:6381' --rdb ./backups/dump.rdb
```

# Import local snapshot into remote

## 1. Load rdb into a local Redis instance

```zsh
redis-server --dir /path/to/your_backup --dbfilename dump.rdb
```

**Example using local-redis Docker container**

Since I mount ./local-redis-data to /data of local-redis already, we simply replace dump.rdb there

## 2. Connect remote Redis as a replica (slave) of local Redis

```zsh
redis-cli -u 'redis://<username>:<password>@<remote-hostname>:<port>' replicaof <your-local-ip> 6379
```

**Example**

- We will treat test-redis instance as remote
- And local-redis instance as local

```zsh
redis-cli -u 'redis://:yoyo@127.0.0.1:6381' replicaof 127.0.0.1 6380
```

## 3. Close connection when sync completes

```zsh
redis-cli -u 'redis://<username>:<password>@<remote-hostname>:<port>' replicaof no one
```

**Example**

```zsh
redis-cli -u 'redis://:yoyo@127.0.0.1:6381' replicaof no one
```

# Dev container

## 1. Run docker compose up

This will create the whole environment for you in the background

```zsh
docker compose up -d
```

## 2. List container ids

```zsh
docker ps -a
```

## 3. Execute an interactive terminal

```zsh
docker exec -it <container_id> bash
```
