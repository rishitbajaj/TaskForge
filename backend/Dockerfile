# Use official lightweight Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package configurations first to leverage layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy all local backend codebase source files
COPY . .

# Expose our API pipeline port
EXPOSE 5000

# Fire up our server engine
CMD ["node", "server.js"]