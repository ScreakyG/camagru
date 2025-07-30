#!/bin/bash

echo "🚀 Démarrage du build de Camagru"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour nettoyer à l'arrêt
cleanup() {
    echo -e "\n${YELLOW}🛑 Arrêt des services...${NC}"
    docker-compose -f docker-compose.yml down
    exit 0
}

# Gerer Ctrl+C
trap cleanup SIGINT SIGTERM

# Démarrer Docker en arrière-plan
echo -e "${BLUE}🐳 Démarrage des conteneurs Docker...${NC}"
docker-compose -f docker-compose.yml up -d --build

# Attendre que les services soient prêts
echo -e "${YELLOW}⏳ Attente du démarrage des services...${NC}"
sleep 3

echo -e "${GREEN}✅ Build prêt !${NC}"
echo -e "📋 Services disponibles :"
echo -e "   • Application: ${BLUE}http://localhost:8080${NC}"
echo -e ""
echo -e "${YELLOW}📝 Logs en temps réel :${NC}"

# Suivre les logs Docker
docker-compose -f docker-compose.yml logs -f
