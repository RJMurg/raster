# syntax=docker/dockerfile:1
ARG NODE_IMAGE=node:24-alpine

# Everything needed to build. Only the manifests are copied, so this layer is reused until the
# dependencies change
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts

# Only what the built server imports at runtime; everything else is bundled into build/
FROM ${NODE_IMAGE} AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund --ignore-scripts

FROM deps AS build
COPY . .
RUN npx svelte-kit sync && npm run build

FROM ${NODE_IMAGE} AS app
WORKDIR /app

# Nothing runs npm at runtime, so drop it (and the vulnerabilities its bundled dependencies collect)
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack

ENV NODE_ENV=production
ENV PORT=3000

# Files stay root-owned (read-only to the app's user)
COPY package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build

USER node
EXPOSE 3000

# The app is served from /raster, so / is a 404
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --start-interval=3s \
    CMD ["sh", "-c", "wget -q --spider http://127.0.0.1:3000/raster/ || exit 1"]

CMD ["node", "build"]
