# Etapa 1, compilacion del proyecto Angular con Node 20 como pide el ejercicio.
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Etapa 2, solo los archivos estaticos servidos por nginx.
# La imagen final no lleva Node ni node_modules, por eso pesa pocos MB.
FROM nginx:1.27-alpine

COPY --from=build /app/dist/lifegoals/browser /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Render inyecta PORT en tiempo de ejecucion. El entrypoint de nginx
# sustituye la variable dentro de la plantilla antes de arrancar.
ENV PORT=8080
EXPOSE 8080
