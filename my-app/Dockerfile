FROM node:20

WORKDIR /usr/src/app

# Copy only package files first (leverages Docker layer caching)
COPY package*.json ./

RUN npm install


COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
