FROM ubuntu:latest

# Use bash for the shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# === 1. Setup environment ===

# https://gist.github.com/marvell/7c812736565928e602c4
RUN apt update && apt install -y \
    build-essential \
    curl \
    git \
    redis \
    && rm -rf /var/lib/apt/lists/*

# === 1a. Install nvm ===

# https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating

# Create a script file sourced by both interactive and non-interactive bash shells
ENV BASH_ENV=/root/.bash_env
RUN touch "${BASH_ENV}"
RUN echo '. "${BASH_ENV}"' >> ~/.bashrc

# Download and install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | PROFILE="${BASH_ENV}" bash
RUN nvm install --lts

# === 1b. Install pnpm ===

RUN npm install -g pnpm

# === 2. Copy project into Docker ===

WORKDIR /app

COPY ./backups /app/backups 
COPY ./node-server /app/node-server

WORKDIR /app/node-server

RUN rm -rf dist node_modules
RUN pnpm install
RUN pnpm build

ENTRYPOINT ["/bin/bash", "-o", "pipefail", "-c"]

CMD ["pnpm start"]