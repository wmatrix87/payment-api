FROM node:12.17.0

# Create app directory
RUN mkdir -p /usr/src/payment-api
WORKDIR /usr/src/payment-api

# Install app dependencies
COPY package.json /usr/src/payment-api
RUN npm install

# Bundle app source
COPY . /usr/src/payment-api

# Build arguments
ARG NODE_VERSION=12.17.0

# Environment
ENV NODE_VERSION $NODE_VERSION
