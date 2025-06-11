FROM node:20

WORKDIR /usr/src/app

# Copy only package files first (leverages Docker layer caching)
COPY package*.json ./

# Install deps inside container (correct platform)
RUN npm install

# Then copy your app source
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
