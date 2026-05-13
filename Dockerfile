# Step 1: Build stage
FROM node:24-alpine AS build
WORKDIR /app

# Install build-time dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev

COPY . .
RUN npm ci && npm run build

# Step 2: Production stage
FROM node:24-alpine
WORKDIR /app

# Install runtime dependencies (required for the compiled binary to run)
RUN apk add --no-cache \
    pixman \
    cairo \
    pango \
    libjpeg-turbo \
    giflib

COPY --from=build /app/static ./static
COPY --from=build /app/package*.json ./
# Note: omit-dev still needs these libraries present to link correctly
RUN npm ci --omit=dev --ignore-scripts
COPY --from=build /app/build ./

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --start-interval=3s \
    CMD ["sh", "-c", "wget -q --spider http://127.0.0.1:3000/ || exit 1"]

CMD ["node", "./"]
