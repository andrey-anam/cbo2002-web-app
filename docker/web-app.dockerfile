# ====== STAGE 1: BUILD ======
FROM node:24.5.0 AS build
WORKDIR /app

# Instala deps com cache eficiente
COPY package*.json ./
RUN npm ci

# Copia código e builda
COPY . .
RUN npm run build

# ====== STAGE 2: RUNTIME ======
FROM node:24.5.0 AS runtime
WORKDIR /app

# Instala o server de arquivos estáticos (SPA)
RUN npm i -g serve@14

# Opcional: copiar package.json só para manter "npm run serve" funcional
COPY package*.json ./

# Copia os artefatos do build
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 4173

# usa o script "serve" do package.json
CMD ["npm", "run", "serve"]
