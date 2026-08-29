FROM node:20-bookworm-slim

# Install system compilers and runtime dependencies for execution engine
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    default-jdk \
    python3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /app

# Copy package files and Prisma schema first for layer caching
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install npm dependencies
RUN npm ci --legacy-peer-deps

# Copy remaining backend source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS backend application
RUN npm run build

# Expose port (Render automatically sets PORT env var)
EXPOSE 3001

# Run Prisma production migrations before starting NestJS server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
