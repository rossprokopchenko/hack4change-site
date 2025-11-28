# =====================
# Base image
# =====================
FROM node:20-alpine AS base

# Install libc6-compat for Alpine if needed by some deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# =====================
# Install dependencies
# =====================
FROM base AS deps

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# =====================
# Build Next.js
# =====================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code
COPY . .

# Disable Next.js telemetry during build (optional)
ENV NEXT_TELEMETRY_DISABLED 1

# Build the app
RUN npm run build

# =====================
# Production image
# =====================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create prerender cache directory and set permissions (safe)
RUN mkdir -p .next && chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
