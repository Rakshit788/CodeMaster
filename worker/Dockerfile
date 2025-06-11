FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y docker.io
# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install
EXPOSE 3002
# Copy rest of the app
COPY . .
CMD ["npm", "run", "dev"]
FROM node:20-alpine

# Install Docker CLI dependencies
RUN apk add --no-cache docker-cli

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]
