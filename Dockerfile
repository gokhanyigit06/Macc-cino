FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma Client using local binary
RUN ./node_modules/.bin/prisma generate

EXPOSE 80

CMD ["node", "server.js"]
