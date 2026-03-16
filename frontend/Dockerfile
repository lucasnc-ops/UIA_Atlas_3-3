# =============================================
# Stage 1: Build the Vite app
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Accept VITE_API_URL as a build arg (set in Railway as a build variable)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Build the production bundle
RUN npm run build

# =============================================
# Stage 2: Serve the static files
# =============================================
FROM node:20-alpine

# Install 'serve' for a lightweight static file server
RUN npm install -g serve

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Railway injects PORT at runtime; default to 3000
ENV PORT=3000
EXPOSE 3000

# serve -s = SPA mode (redirects all paths to index.html)
CMD sh -c "serve -s dist -l ${PORT}"
