
# ===== Stage 1: Build =====
FROM node:22-alpine AS builder

WORKDIR /app

ENV HTTP_PROXY=""
ENV HTTPS_PROXY=""
ENV NO_PROXY="*"

# Install dependencies
COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps --no-audit --no-fund

# Copy source code
COPY . .

# Build Vite application
RUN npm run build


# ===== Stage 2: Production =====
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
