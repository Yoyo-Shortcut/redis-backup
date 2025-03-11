FROM ubuntu:latest

# === 1. Setup environment ===

RUN apt update && apt install -y \
    build-essential \
    procps \
    curl \
    file \
    git

# Set up Homebrew
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
RUN echo 'export PATH="/home/linuxbrew/.linuxbrew/bin:$PATH"' >> ~/.profile

SHELL ["/bin/bash", "-l", "-c"]

# Install redis and redis-cli
RUN brew install redis

# Install nvm
RUN brew install nvm
RUN chmod +x "$(brew --prefix nvm)/nvm.sh"
RUN echo 'export NVM_DIR="$(brew --prefix nvm)"' >> ~/.profile
RUN echo '[ -s "$(brew --prefix nvm)/nvm.sh" ] && \. "$(brew --prefix nvm)/nvm.sh"' >> ~/.profile
RUN echo '[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix nvm)/etc/bash_completion.d/nvm"' >> ~/.profile

# Install pnpm
RUN brew install pnpm

# Install Node.js LTS
RUN nvm install --lts
RUN nvm use --lts

# === 2. Copy project into Docker ===

WORKDIR /app

COPY ./backups /app/backups 
COPY ./node-server /app/node-server

WORKDIR /app/node-server

RUN rm -rf dist node_modules
RUN pnpm install
RUN pnpm build

ENTRYPOINT ["/bin/bash", "-l", "-c"]

CMD ["pnpm start"]