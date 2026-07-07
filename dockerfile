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

# --- Runtime Stage: Static frontend ---
FROM nginx:stable-alpine AS runtime

# Create the path that PXXL runtime wrapper expects
RUN mkdir -p /workspace/app/frontend

# Copy built frontend output into the expected path and Nginx serving directory
COPY --from=builder /workspace/app/frontend/dist /workspace/app/frontend
COPY --from=builder /workspace/app/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
