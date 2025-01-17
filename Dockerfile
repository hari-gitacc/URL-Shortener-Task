FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies including development dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Default command (will be overridden by docker-compose in development)
CMD ["npm", "start"]