# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN yarn build && yarn install --immutable --immutable-cache

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Yarn dependencies
COPY --from=builder /app/.yarn ./.yarn
copy --from=builder /app/.yarnrc.yml ./
copy --from=builder /app/.pnp.cjs ./

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./

USER nextjs

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]