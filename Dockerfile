FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma Client using local dependency. DATABASE_URL (PostgreSQL) is
# provided by the host (Coolify) and is available at build time.
RUN npx prisma generate

EXPOSE 80

# Sync schema to the PostgreSQL database, ensure the admin user exists, then
# start. PostgreSQL persists across redeploys, so admin changes are kept.
# (seed.js no longer inserts demo content.)
CMD ["sh", "-c", "npx prisma db push && node prisma/seed.js && node server.js"]
