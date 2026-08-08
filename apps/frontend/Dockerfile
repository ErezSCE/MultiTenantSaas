# syntax=docker/dockerfile:1

# ---------- Build Stage ----------
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm config set strict-ssl false && npm install --omit=dev

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Healthcheck using curl to the default page
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget -qO- http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]
