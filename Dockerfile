# ---- Stage 1: Build the Next.js app ----
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js app
RUN npm run build

# ---- Stage 2: Run the app ----
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
