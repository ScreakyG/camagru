FROM node:20-alpine
WORKDIR /app

# Utile pour aller regarder des infos sur la DB dans le container
RUN apk add sqlite
# Copie les dependences.
COPY back/package*.json ./
# Installe les dependences.
RUN npm install
# Copy les fichiers sources.
COPY back/src/ ./src/
#Copy les overlays
COPY back/overlays ./overlays/
# L'API communique via le port 3000.
EXPOSE 3000
# Lance le server au demmarage du container.
# CMD ["node", "src/server.js"]
CMD ["npm", "run", "start"]
