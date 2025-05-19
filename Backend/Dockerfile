# Stage 1: Build the Node.js backend
FROM node:22-alpine AS build-stage

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
# !?? https://github.com/npm/cli/issues/4028#issuecomment-2468020714
RUN npm install -g npm@10.3.0 && npm ci

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 4080

# Start the Node.js server
CMD ["node", "index.js"]