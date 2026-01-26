FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma Client using local dependency
RUN npx prisma generate

EXPOSE 80

# Run db push (sync schema) and seed, then start server
CMD ["sh", "-c", "npx prisma db push && node prisma/seed.js && node server.js"]
