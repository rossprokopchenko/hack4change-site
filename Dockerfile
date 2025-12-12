# =====================
# Build stage
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
# Use --legacy-peer-deps to handle Storybook peer dependency (dev-only, not used in production)
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build the Next.js app
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

# Install only necessary libraries (remove curl/wget to prevent malware downloads)
RUN apk add --no-cache libc6-compat

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure prerender cache directory exists
RUN mkdir -p .next && chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

# Add healthcheck using Node.js (no external tools needed)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Use server.js to start the Next.js app
CMD ["node", "server.js"]
