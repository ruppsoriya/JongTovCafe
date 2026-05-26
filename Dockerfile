FROM node:18-bullseye-slim

WORKDIR /usr/src/app/backend

ENV NODE_ENV=production
ENV PORT=5000

# Install build tools for native modules (sqlite3), then install backend deps
RUN apt-get update && apt-get install -y python3 make g++ \
	&& rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./

EXPOSE 5000

CMD ["node", "server.js"]