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

# Run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
