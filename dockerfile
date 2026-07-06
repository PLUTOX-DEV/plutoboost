# Root Dockerfile for PlutoBoost monorepo
FROM node:18-alpine AS builder
WORKDIR /workspace/app

# Install frontend dependencies and build
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci
COPY frontend/ frontend/
RUN cd frontend && npm run build

# Install backend dependencies
FROM node:18-alpine AS runtime
WORKDIR /workspace/app
COPY backend/package*.json backend/
RUN cd backend && npm ci --production
COPY backend/ backend/
COPY --from=builder /workspace/app/frontend/dist backend/frontend/dist

WORKDIR /workspace/app/backend
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
