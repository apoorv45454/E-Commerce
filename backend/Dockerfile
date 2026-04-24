FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source code
COPY . .

# Expose the port the backend runs on
EXPOSE 5000

# Run the backend
CMD [ "node", "server.js" ]
