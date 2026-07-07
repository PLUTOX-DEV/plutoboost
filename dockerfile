# Root Dockerfile for PlutoBoost monorepo
# This Dockerfile creates a single, self-contained image for the full-stack application.

# --- Build Stage: Frontend ---
FROM node:18-alpine AS builder
WORKDIR /workspace/app

# Install frontend dependencies and build
COPY frontend/package*.json frontend/
RUN cd frontend && npm install
COPY frontend/ frontend/
RUN cd frontend && npm run build

# --- Runtime Stage: Backend ---
FROM node:18-alpine AS runtime
WORKDIR /workspace/app

# Copy backend code and install production dependencies
COPY backend/package*.json backend/
RUN cd backend && npm ci --production
COPY backend/ backend/

# Copy the built frontend from the 'builder' stage into the correct 'dist' folder inside the backend
COPY --from=builder /workspace/app/frontend/dist backend/dist

WORKDIR /workspace/app/backend
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
