FROM ubuntu:latest

RUN apt update && apt install -y \
    build-essential \
    procps \
    curl \
    file \
    git

# Set up Homebrew (non-interactive)
RUN NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install redis and redis-cli
RUN brew install redis