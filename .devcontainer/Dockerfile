FROM mcr.microsoft.com/devcontainers/java:17

# Install Node.js (LTS) and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

# Install Maven
RUN apt-get update && apt-get install -y maven

# Install other utilities
RUN apt-get install -y git curl

# Set up working directory
WORKDIR /workspaces/pcbe2
