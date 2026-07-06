# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Tránh OOM trên VPS nhỏ khi vite build
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV CI=true

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Production uses relative API prefix /api (nginx reverse proxy)
RUN npm run build-only

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9000

CMD ["nginx", "-g", "daemon off;"]
