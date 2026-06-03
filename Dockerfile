FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Persistent SQLite location. Set BEFORE `prisma generate` because Prisma
# validates the datasource URL (from env) at generate time. Mount a volume at
# /app/data on the host so the DB (and all admin changes) survive redeploys.
ENV DATABASE_URL=file:/app/data/prod.db

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma Client using local dependency
RUN npx prisma generate

RUN mkdir -p /app/data

EXPOSE 80

# Sync schema to the persistent DB, ensure the admin user exists, then start.
# (seed.js no longer inserts demo content.)
CMD ["sh", "-c", "npx prisma db push && node prisma/seed.js && node server.js"]
