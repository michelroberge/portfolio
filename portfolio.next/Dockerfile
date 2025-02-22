# Use official Node.js 22 image as a base
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the entire source code from `src/`
COPY src ./src

# Build the Next.js app
RUN npm run build --workspace=src

# Use a smaller base image for production
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/.next ./.next
COPY --from=builder /app/src/public ./public
COPY --from=builder /app/src/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start", "--workspace=src"]
