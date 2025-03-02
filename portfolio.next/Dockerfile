# Use official Node.js 22 image as a base
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy necessary files
COPY package.json package-lock.json tsconfig.json next.config.ts ./
COPY .env ./ 

# Install dependencies
RUN npm install --production

# Copy the entire source code
COPY . .

# Build the Next.js app
RUN npm run build 

# Use a smaller base image for production
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.production ./  

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
