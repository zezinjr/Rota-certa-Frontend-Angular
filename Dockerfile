# Build do Angular servido pelo Caddy. Usado pelo deploy/docker-compose.yml
# do repositório do backend, que monta o Caddyfile e faz o proxy da /api.
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration production
# Mesmo domínio do backend: a API fica em /api (Caddy faz o proxy).
RUN echo '{ "apiBaseUrl": "/api" }' > dist/crud-angular-material/browser/assets/config/config.json

FROM caddy:2.8-alpine
COPY --from=build /app/dist/crud-angular-material/browser /srv/app
