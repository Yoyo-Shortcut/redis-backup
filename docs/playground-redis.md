# Docs

- [Main Doc](../README.md)

# Table of contents

- [Docs](#docs)
- [Table of contents](#table-of-contents)
- [Run Docker containers](#run-docker-containers)
  - [1. Run docker compose up](#1-run-docker-compose-up)
  - [2. List container ids](#2-list-container-ids)
  - [3. Execute an interactive terminal](#3-execute-an-interactive-terminal)
- [Make sure there are some data in remote](#make-sure-there-are-some-data-in-remote)
- [Export remote snapshot to local](#export-remote-snapshot-to-local)
  - [1. Take a snapshot rdb](#1-take-a-snapshot-rdb)
- [Import local snapshot into remote](#import-local-snapshot-into-remote)
  - [1. Load rdb into a local Redis instance](#1-load-rdb-into-a-local-redis-instance)
  - [2. Connect remote Redis as a replica (slave) of local Redis](#2-connect-remote-redis-as-a-replica-slave-of-local-redis)
  - [3. Close connection when sync completes](#3-close-connection-when-sync-completes)

# Run Docker containers

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

# Make sure there are some data in remote

**Example using `test-redis` Docker container**

Go into `test-redis` instance with Redis Insight or some other ways

- username = default
- password = yoyo
- host = 127.0.0.1
- port = 6381

Fill in some test key-value pairs

# Export remote snapshot to local

## 1. Take a snapshot rdb

```zsh
redis-cli -u 'redis://<username>:<password>@<hostname>:<port>' --rdb your_backup.rdb
```

**Example using `test-redis` Docker container**

```zsh
redis-cli -u 'redis://default:yoyo@127.0.0.1:6381' --rdb ./backups/dump.rdb
```

# Import local snapshot into remote

## 1. Load rdb into a local Redis instance

```zsh
redis-server --dir /path/to/your_backup --dbfilename dump.rdb
```

**Example using `local-redis` Docker container**

- Since I mount local folder `./local-redis-data` to Docker folder `/data` of `local-redis` already, we simply replace `dump.rdb` there

```zsh
sudo cp -f ./backups/dump.rdb ./local-redis-data/dump.rdb
```

- Then, we stop `local-redis` container and rerun `docker compose up -d` to restart Redis server with new `dump.rdb` file

- Before moving to step 2, when we are testing, we want to:

  - Stop `test-redis` container
  - Remove `dump.rdb` in `./test-redis-data`
  - Restart `test-redis` container so its database is now empty and ready to replicate

**NOTE**: With Redis `REPLICAOF`, you don't really need to clear the database

- But we want to clear `test-redis` in this case since it will showcase the changes more clearly when we restore the data

## 2. Connect remote Redis as a replica (slave) of local Redis

```zsh
redis-cli -u 'redis://<username>:<password>@<remote-hostname>:<port>' config set masterauth <password>
redis-cli -u 'redis://<username>:<password>@<remote-hostname>:<port>' replicaof <your-local-ip> <your-local-port>
```

**Example**

- We will treat `test-redis` instance as remote
- And `local-redis` instance as local

**IMPORTANT**: Get ip address of container or your machine

- This helps with Docker networking issues while replicating Redis

```zsh
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' redis-backup-local-redis-1

or

ipconfig
```

Start making port 6381 (`test-redis`) replicating port 6380 (`local-redis`)

```zsh
redis-cli -u 'redis://default:yoyo@127.0.0.1:6381' config set masterauth yoyo
redis-cli -u 'redis://default:yoyo@127.0.0.1:6381' config get '*'
redis-cli -u 'redis://default:yoyo@127.0.0.1:6381' replicaof '<ip-address>' '6380'

redis-cli -u 'redis://default:yoyo@127.0.0.1:6380' info replication
redis-cli -u 'redis://default:yoyo@127.0.0.1:6381' info replication
```

## 3. Close connection when sync completes

```zsh
redis-cli -u 'redis://<username>:<password>@<remote-hostname>:<port>' replicaof no one
```

**Example**

```zsh
redis-cli -u 'redis://default:yoyo@127.0.0.1:6381' replicaof no one
```
