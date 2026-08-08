# syntax=docker/dockerfile:1

# ---------- Build Stage ----------
FROM node:20-slim AS builder
WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* ./
RUN npm config set strict-ssl false && npm ci

# Copy source code
COPY . .

# Build the NestJS application
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:20-slim AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy only the compiled output and production deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Use non-root user
USER appuser

EXPOSE 3001

# Healthcheck – simple TCP check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD curl -f http://localhost:3001/ || exit 1

CMD ["node", "dist/main.js"]
