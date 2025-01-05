# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY ./front-end/package.json ./front-end/package-lock.json ./

RUN npm install

COPY ./front-end ./

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built front-end
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
