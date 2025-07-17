#!/bin/bash

echo "🚀 Démarrage de l'environnement de développement Camagru"

# Couleurs pour les logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour nettoyer à l'arrêt
cleanup() {
    echo -e "\n${YELLOW}🛑 Arrêt des services...${NC}"
    docker-compose -f docker-compose.dev.yml down
    kill $CSS_PID 2>/dev/null
    exit 0
}

# Gérer Ctrl+C
trap cleanup SIGINT SIGTERM

# Vérifier que les dépendances sont installées
if [ ! -d "app/node_modules" ]; then
    echo -e "${BLUE}📦 Installation des dépendances...${NC}"
    cd app && npm install && cd ..
fi

# Démarrer Docker en arrière-plan
echo -e "${BLUE}🐳 Démarrage des conteneurs Docker...${NC}"
docker-compose -f docker-compose.dev.yml up -d

# Attendre que les services soient prêts
echo -e "${YELLOW}⏳ Attente du démarrage des services...${NC}"
sleep 3

# Démarrer le build CSS en watch mode
echo -e "${BLUE}🎨 Démarrage du build CSS...${NC}"
cd app
npm run build-css &
CSS_PID=$!
cd ..

echo -e "${GREEN}✅ Environnement de développement prêt !${NC}"
echo -e "📋 Services disponibles :"
echo -e "   • Application: ${BLUE}http://localhost:8080${NC}"
echo -e ""
echo -e "${YELLOW}📝 Logs en temps réel :${NC}"

# Suivre les logs Docker
docker-compose -f docker-compose.dev.yml logs -f
