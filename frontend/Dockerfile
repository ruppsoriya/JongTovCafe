FROM node:18-alpine AS builder

WORKDIR /usr/src/app

ENV NEXT_TELEMETRY_DISABLED=1

# Install all deps for build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Install only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets and necessary files
COPY --from=builder /usr/src/app/.next .next
COPY --from=builder /usr/src/app/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
