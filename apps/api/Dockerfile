FROM node:20-slim AS builder

WORKDIR /workspace

# Prisma requires OpenSSL at runtime (and during generate in this image).
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.30.1 --activate

ENV NX_DAEMON=false

# Copy workspace manifests first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json tsconfig.json ./

# Copy sources needed to build the API
COPY apps/api ./apps/api
COPY libs ./libs

RUN pnpm install --frozen-lockfile

# Build + prune into apps/api/dist (includes pruned package.json/lockfile/workspace_modules)
RUN pnpm nx sync && pnpm nx run @gps/api:prune

FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Prisma runtime dependency.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.30.1 --activate

ENV NX_DAEMON=false

COPY --from=builder /workspace/apps/api/dist ./

# Install runtime deps based on pruned lockfile/package.json produced by Nx targets
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "main.js"]
