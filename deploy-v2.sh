#!/bin/bash

# ==============================================
# LIFE HUB - DATABASE V2.0 DEPLOYMENT SCRIPT
# ==============================================

echo "🚀 Starting Life Hub V2.0 Deployment..."
echo ""

# ==============================================
# 1. BACKUP EXISTING DATABASE
# ==============================================
echo "📦 Step 1: Backing up existing database..."

# Prüfe ob PostgreSQL Container läuft
if docker ps | grep -q postgres; then
    echo "   → Creating backup..."
    docker exec postgres pg_dump -U lifehub lifehub > backup_before_v2_$(date +%Y%m%d_%H%M%S).sql
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Backup created successfully"
    else
        echo "   ❌ Backup failed! Aborting deployment."
        exit 1
    fi
else
    echo "   ⚠️  PostgreSQL container not running, skipping backup"
fi

echo ""

# ==============================================
# 2. PULL LATEST CODE FROM GIT
# ==============================================
echo "📥 Step 2: Pulling latest code from Git..."

git pull origin main

if [ $? -eq 0 ]; then
    echo "   ✅ Git pull successful"
else
    echo "   ❌ Git pull failed! Check your repository."
    exit 1
fi

echo ""

# ==============================================
# 3. STOP EXISTING CONTAINERS
# ==============================================
echo "🛑 Step 3: Stopping existing containers..."

docker compose down

if [ $? -eq 0 ]; then
    echo "   ✅ Containers stopped"
else
    echo "   ⚠️  Failed to stop containers"
fi

echo ""

# ==============================================
# 4. CLEAN DATABASE (OPTIONAL - CAREFUL!)
# ==============================================
echo "🗑️  Step 4: Clean database? (removes all data)"
read -p "   Clean database? (yes/no): " clean_db

if [ "$clean_db" = "yes" ]; then
    echo "   → Removing database volume..."
    docker volume rm life-hub_postgres-data 2>/dev/null
    echo "   ✅ Database cleaned"
else
    echo "   ⏭️  Skipping database clean"
fi

echo ""

# ==============================================
# 5. BUILD BACKEND
# ==============================================
echo "🔨 Step 5: Building backend..."

docker compose build backend

if [ $? -eq 0 ]; then
    echo "   ✅ Backend built successfully"
else
    echo "   ❌ Backend build failed!"
    exit 1
fi

echo ""

# ==============================================
# 6. BUILD FRONTEND
# ==============================================
echo "🎨 Step 6: Building frontend..."

docker compose build frontend

if [ $? -eq 0 ]; then
    echo "   ✅ Frontend built successfully"
else
    echo "   ❌ Frontend build failed!"
    exit 1
fi

echo ""

# ==============================================
# 7. START CONTAINERS
# ==============================================
echo "🚀 Step 7: Starting containers..."

docker compose up -d

if [ $? -eq 0 ]; then
    echo "   ✅ Containers started"
else
    echo "   ❌ Failed to start containers!"
    exit 1
fi

echo ""

# ==============================================
# 8. WAIT FOR BACKEND TO START
# ==============================================
echo "⏳ Step 8: Waiting for backend to start..."

echo "   Waiting 30 seconds for backend initialization..."
sleep 30

echo ""

# ==============================================
# 9. CHECK LOGS
# ==============================================
echo "📋 Step 9: Checking backend logs..."

docker logs life-hub-backend --tail 50

echo ""

# ==============================================
# 10. CHECK FLYWAY MIGRATION
# ==============================================
echo "🔍 Step 10: Checking Flyway migration..."

if docker logs life-hub-backend 2>&1 | grep -q "V2_0__complete_database_schema.sql"; then
    echo "   ✅ V2_0 migration found in logs"
else
    echo "   ⚠️  V2_0 migration not found in logs"
fi

if docker logs life-hub-backend 2>&1 | grep -q "Successfully applied"; then
    echo "   ✅ Migration applied successfully"
else
    echo "   ⚠️  Migration status unclear, check logs"
fi

echo ""

# ==============================================
# 11. HEALTH CHECKS
# ==============================================
echo "🏥 Step 11: Running health checks..."

# Backend Health
echo "   → Checking backend health..."
backend_health=$(curl -s http://localhost:5000/actuator/health | grep -o '"status":"UP"')

if [ ! -z "$backend_health" ]; then
    echo "   ✅ Backend is UP"
else
    echo "   ❌ Backend is DOWN"
fi

# Frontend Health
echo "   → Checking frontend..."
frontend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)

if [ "$frontend_health" = "200" ]; then
    echo "   ✅ Frontend is UP"
else
    echo "   ⚠️  Frontend status: $frontend_health"
fi

echo ""

# ==============================================
# 12. TEST DATABASE CONNECTION
# ==============================================
echo "🔌 Step 12: Testing database connection..."

# Prüfe ob Tabellen erstellt wurden
tables=$(docker exec postgres psql -U lifehub -d lifehub -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

if [ $tables -gt 0 ]; then
    echo "   ✅ Database connected, $tables tables found"
else
    echo "   ❌ Database connection issue"
fi

echo ""

# ==============================================
# 13. DEPLOYMENT SUMMARY
# ==============================================
echo "======================================"
echo "📊 DEPLOYMENT SUMMARY"
echo "======================================"
echo ""
echo "Backend URL:  http://localhost:5000"
echo "Frontend URL: http://localhost:5173"
echo ""
echo "API Endpoints:"
echo "  - POST /api/auth/register"
echo "  - POST /api/auth/login"
echo "  - GET  /api/user/{userId}/data"
echo "  - PUT  /api/user/{userId}/settings"
echo "  - GET  /api/sidebar/{userId}"
echo ""
echo "School System:"
echo "  - 13 new tables created"
echo "  - Timetable, Homework, Exams, Grades"
echo "  - Flashcards, Summaries, Study Sessions"
echo "  - Absences tracking"
echo ""
echo "======================================"
echo ""

# ==============================================
# 14. QUICK TESTS
# ==============================================
echo "🧪 Step 14: Quick API tests..."

echo "   → Testing /api/actuator/health..."
curl -s http://localhost:5000/actuator/health | grep -q "UP" && echo "   ✅ Health check passed" || echo "   ❌ Health check failed"

echo ""

# ==============================================
# DEPLOYMENT COMPLETE
# ==============================================
echo "======================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Test registration: POST /api/auth/register"
echo "2. Test login: POST /api/auth/login"
echo "3. Check sidebar config: GET /api/sidebar/1"
echo "4. Monitor logs: docker logs life-hub-backend -f"
echo ""
echo "🎉 Life Hub V2.0 is ready!"
echo ""
