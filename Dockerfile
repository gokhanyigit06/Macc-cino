FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Install Prisma CLI globally to ensure availability
RUN npm install -g prisma@5.10.2

COPY . .

# Generate Prisma Client
RUN prisma generate

EXPOSE 80

CMD ["node", "server.js"]
