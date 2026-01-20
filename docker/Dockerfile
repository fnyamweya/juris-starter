# Build stage
FROM node:20-alpine AS builder

ARG SERVICE_NAME

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/core/package*.json ./packages/core/
COPY packages/database/package*.json ./packages/database/
COPY packages/common/package*.json ./packages/common/
COPY packages/events/package*.json ./packages/events/
COPY services/${SERVICE_NAME}/package*.json ./services/${SERVICE_NAME}/

# Install dependencies
RUN npm ci --workspace=packages/core --workspace=packages/database --workspace=packages/common --workspace=packages/events --workspace=services/${SERVICE_NAME}

# Copy source files
COPY tsconfig.json ./
COPY packages/core ./packages/core
COPY packages/database ./packages/database
COPY packages/common ./packages/common
COPY packages/events ./packages/events
COPY services/${SERVICE_NAME} ./services/${SERVICE_NAME}

# Build packages and service
RUN npm run build --workspace=packages/core
RUN npm run build --workspace=packages/database
RUN npm run build --workspace=packages/common
RUN npm run build --workspace=packages/events
RUN npm run build --workspace=services/${SERVICE_NAME}

# Production stage
FROM node:20-alpine AS production

ARG SERVICE_NAME

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/core/package*.json ./packages/core/
COPY packages/database/package*.json ./packages/database/
COPY packages/common/package*.json ./packages/common/
COPY packages/events/package*.json ./packages/events/
COPY services/${SERVICE_NAME}/package*.json ./services/${SERVICE_NAME}/

# Install production dependencies only
RUN npm ci --workspace=packages/core --workspace=packages/database --workspace=packages/common --workspace=packages/events --workspace=services/${SERVICE_NAME} --omit=dev

# Copy built files
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/events/dist ./packages/events/dist
COPY --from=builder /app/services/${SERVICE_NAME}/dist ./services/${SERVICE_NAME}/dist

# Set environment
ENV NODE_ENV=production
ENV SERVICE_NAME=${SERVICE_NAME}

# Expose port (will be overridden by docker-compose)
EXPOSE 3000

# Start the service
CMD ["sh", "-c", "node services/${SERVICE_NAME}/dist/main.js"]
