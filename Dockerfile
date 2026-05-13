# Step 1: Build stage
FROM node:24-alpine AS build
WORKDIR /app

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

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --production

# Step 2: Production stage
FROM node:24-alpine
WORKDIR /app

RUN apk add --no-cache \
    pixman \
    cairo \
    pango \
    libjpeg-turbo \
    giflib

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/static ./static
COPY --from=build /app/build ./build

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --start-interval=3s \
    CMD ["sh", "-c", "wget -q --spider http://127.0.0.1:3000/ || exit 1"]

CMD ["node", "build"]
