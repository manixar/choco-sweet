# ===== Stage 1: Builder =====
FROM node:22-alpine AS builder

# ===== FIX: Refresh repository =====
RUN apk update --no-cache

WORKDIR /app

# ===== Proxy Settings (DISABLED) =====
ENV HTTP_PROXY="" \
    HTTPS_PROXY="" \
    http_proxy="" \
    https_proxy="" \
    NO_PROXY="*" \
    npm_config_proxy="" \
    npm_config_https_proxy=""

# ===== LAYER 1: OS Dependencies (cached) =====
RUN apk add --no-cache --update-cache git python3 make g++ curl

# ===== LAYER 2: Dependencies (cached unless package.json changes) =====
COPY package.json package-lock.json* yarn.lock* ./

RUN if [ -f "yarn.lock" ]; then \
        yarn install --frozen-lockfile --network-timeout 100000; \
    else \
        npm install --legacy-peer-deps --no-audit --no-fund; \
    fi

# ===== LAYER 3: Copy source code =====
COPY . .

# ===== LAYER 4: Build =====
ENV NEXT_TYPESCRIPT_IGNORE_BUILD_ERRORS=true
ENV NEXT_DISABLE_SERVER_ACTIONS=true
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN if [ -f "yarn.lock" ]; then \
        yarn build; \
    else \
        npm run build; \
    fi

# ===== Stage 2: Production =====
FROM node:22-alpine

# ===== FIX: Refresh repository =====
RUN apk update --no-cache

WORKDIR /app

# ===== Proxy Settings (DISABLED) =====
ENV HTTP_PROXY="" \
    HTTPS_PROXY="" \
    http_proxy="" \
    https_proxy="" \
    NO_PROXY="*" \
    npm_config_proxy="" \
    npm_config_https_proxy=""

# ===== LAYER 1: OS Dependencies =====
RUN apk add --no-cache --update-cache curl

# ===== LAYER 2: Copy package files =====
COPY package.json package-lock.json* yarn.lock* ./

# ===== LAYER 3: Install production dependencies =====
RUN if [ -f "yarn.lock" ]; then \
        yarn install --production --frozen-lockfile --network-timeout 100000; \
    else \
        npm install --omit=dev --legacy-peer-deps --no-audit --no-fund; \
    fi

# ===== LAYER 4: Copy build artifacts =====
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# ===== LAYER 5: Copy config files =====
RUN --mount=type=bind,from=builder,source=/app,target=/builder \
    if [ -f /builder/next.config.js ]; then cp /builder/next.config.js ./; fi && \
    if [ -f /builder/.babelrc ]; then cp /builder/.babelrc ./; fi

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD if [ -f "yarn.lock" ]; then yarn start; else npm run start; fi