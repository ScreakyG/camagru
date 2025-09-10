FROM node:20-alpine AS builder
WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY app/ .
RUN npm run build

FROM nginx:alpine
#Copy my nginx config file.
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app /var/www/static

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
