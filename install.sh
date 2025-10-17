#!/bin/bash

# =====================================================
# Life Hub - Quick Install Script for Linux/NAS
# =====================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo -e "  Life Hub - Installation Script"
echo -e "========================================${NC}\n"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}ERROR: docker-compose.yml not found.${NC}"
    echo -e "${RED}Please run this script from the Life-Hub root directory.${NC}"
    exit 1
fi

# Step 1: Install frontend dependencies
echo -e "${YELLOW}[1/5] Installing frontend dependencies...${NC}"
cd frontend
npm install react-syntax-highlighter @types/react-syntax-highlighter
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: npm install failed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Step 2: Create data directories
echo -e "${YELLOW}[2/5] Creating data directories...${NC}"
cd ..
mkdir -p /volume1/docker/Life-Hub-Data/Sarkei/{privat,arbeit,schule}
echo -e "${GREEN}✓ Directories created${NC}\n"

# Step 3: Run database migration
echo -e "${YELLOW}[3/5] Running database migration...${NC}"
if [ -f "backend/src/main/resources/db/migration/V1_0__notes_system_enhancement.sql" ]; then
    docker exec -i lifehub-db psql -U lifehub -d lifehub < backend/src/main/resources/db/migration/V1_0__notes_system_enhancement.sql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database migration completed${NC}\n"
    else
        echo -e "${YELLOW}⚠ Database migration might have issues. Check manually.${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠ Migration file not found. Skipping...${NC}\n"
fi

# Step 4: Rebuild Docker containers
echo -e "${YELLOW}[4/5] Rebuilding Docker containers...${NC}"
docker-compose down
docker-compose build --no-cache backend frontend
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Docker build failed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Containers built${NC}\n"

# Step 5: Start containers
echo -e "${YELLOW}[5/5] Starting containers...${NC}"
docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Container startup failed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Containers started${NC}\n"

# Wait for containers to be healthy
echo -e "${YELLOW}Waiting for containers to be ready...${NC}"
sleep 10

# Check container status
echo -e "\n${CYAN}========================================"
echo -e "  Container Status:"
echo -e "========================================${NC}"
docker-compose ps

# Show recent logs
echo -e "\n${CYAN}========================================"
echo -e "  Recent Backend Logs:"
echo -e "========================================${NC}"
docker-compose logs --tail=15 backend

# Check if backend is responding
echo -e "\n${YELLOW}Checking backend health...${NC}"
sleep 5
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health || echo "000")
if [ "$HEALTH_CHECK" = "200" ]; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo -e "${YELLOW}⚠ Backend health check returned: $HEALTH_CHECK${NC}"
fi

# Success message
echo -e "\n${GREEN}========================================"
echo -e "  Installation Complete! 🚀"
echo -e "========================================${NC}\n"

echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Open browser: ${CYAN}http://$(hostname -I | awk '{print $1}'):3000${NC}"
echo -e "2. Login with your account"
echo -e "3. Navigate to ${CYAN}'Notizen'${NC} in sidebar"
echo -e "4. Test folder creation and markdown editing\n"

echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  View logs:     ${CYAN}docker-compose logs -f backend${NC}"
echo -e "  Restart:       ${CYAN}docker-compose restart${NC}"
echo -e "  Stop:          ${CYAN}docker-compose down${NC}"
echo -e "  Database CLI:  ${CYAN}docker exec -it lifehub-db psql -U lifehub -d lifehub${NC}\n"

echo -e "${GREEN}Installation script completed successfully!${NC}\n"
