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

CMD ["node", "server.js"]
