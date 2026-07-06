# Backend Dockerfile for production
FROM node:18-alpine

WORKDIR /app

# Install dependencies first (use package-lock if present)
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "index.js"]
