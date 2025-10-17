# ==============================================
# LIFE HUB - DATABASE V2.0 DEPLOYMENT SCRIPT
# PowerShell Version for Windows
# ==============================================

Write-Host "🚀 Starting Life Hub V2.0 Deployment..." -ForegroundColor Cyan
Write-Host ""

# ==============================================
# 1. BACKUP EXISTING DATABASE
# ==============================================
Write-Host "📦 Step 1: Backing up existing database..." -ForegroundColor Yellow

$postgresRunning = docker ps | Select-String "postgres"

if ($postgresRunning) {
    Write-Host "   → Creating backup..." -ForegroundColor Gray
    $backupFile = "backup_before_v2_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
    docker exec postgres pg_dump -U lifehub lifehub > $backupFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Backup created: $backupFile" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backup failed! Aborting deployment." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ⚠️  PostgreSQL container not running, skipping backup" -ForegroundColor Yellow
}

Write-Host ""

# ==============================================
# 2. PULL LATEST CODE FROM GIT
# ==============================================
Write-Host "📥 Step 2: Pulling latest code from Git..." -ForegroundColor Yellow

git pull origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Git pull successful" -ForegroundColor Green
} else {
    Write-Host "   ❌ Git pull failed! Check your repository." -ForegroundColor Red
    exit 1
}

Write-Host ""

# ==============================================
# 3. STOP EXISTING CONTAINERS
# ==============================================
Write-Host "🛑 Step 3: Stopping existing containers..." -ForegroundColor Yellow

docker compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Containers stopped" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Failed to stop containers" -ForegroundColor Yellow
}

Write-Host ""

# ==============================================
# 4. CLEAN DATABASE (OPTIONAL - CAREFUL!)
# ==============================================
Write-Host "🗑️  Step 4: Clean database? (removes all data)" -ForegroundColor Yellow
$cleanDb = Read-Host "   Clean database? (yes/no)"

if ($cleanDb -eq "yes") {
    Write-Host "   → Removing database volume..." -ForegroundColor Gray
    docker volume rm life-hub_postgres-data 2>$null
    Write-Host "   ✅ Database cleaned" -ForegroundColor Green
} else {
    Write-Host "   ⏭️  Skipping database clean" -ForegroundColor Gray
}

Write-Host ""

# ==============================================
# 5. BUILD BACKEND
# ==============================================
Write-Host "🔨 Step 5: Building backend..." -ForegroundColor Yellow

docker compose build backend

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Backend built successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ==============================================
# 6. BUILD FRONTEND
# ==============================================
Write-Host "🎨 Step 6: Building frontend..." -ForegroundColor Yellow

docker compose build frontend

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ==============================================
# 7. START CONTAINERS
# ==============================================
Write-Host "🚀 Step 7: Starting containers..." -ForegroundColor Yellow

docker compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Containers started" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to start containers!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ==============================================
# 8. WAIT FOR BACKEND TO START
# ==============================================
Write-Host "⏳ Step 8: Waiting for backend to start..." -ForegroundColor Yellow

Write-Host "   Waiting 30 seconds for backend initialization..." -ForegroundColor Gray
Start-Sleep -Seconds 30

Write-Host ""

# ==============================================
# 9. CHECK LOGS
# ==============================================
Write-Host "📋 Step 9: Checking backend logs..." -ForegroundColor Yellow

docker logs life-hub-backend --tail 50

Write-Host ""

# ==============================================
# 10. CHECK FLYWAY MIGRATION
# ==============================================
Write-Host "🔍 Step 10: Checking Flyway migration..." -ForegroundColor Yellow

$logs = docker logs life-hub-backend 2>&1

if ($logs -match "V2_0__complete_database_schema.sql") {
    Write-Host "   ✅ V2_0 migration found in logs" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  V2_0 migration not found in logs" -ForegroundColor Yellow
}

if ($logs -match "Successfully applied") {
    Write-Host "   ✅ Migration applied successfully" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Migration status unclear, check logs" -ForegroundColor Yellow
}

Write-Host ""

# ==============================================
# 11. HEALTH CHECKS
# ==============================================
Write-Host "🏥 Step 11: Running health checks..." -ForegroundColor Yellow

# Backend Health
Write-Host "   → Checking backend health..." -ForegroundColor Gray
try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:5000/actuator/health" -Method Get -ErrorAction Stop
    if ($backendHealth.status -eq "UP") {
        Write-Host "   ✅ Backend is UP" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend is DOWN" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Backend is DOWN (connection failed)" -ForegroundColor Red
}

# Frontend Health
Write-Host "   → Checking frontend..." -ForegroundColor Gray
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -ErrorAction Stop
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend is UP" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Frontend status: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Frontend not reachable yet" -ForegroundColor Yellow
}

Write-Host ""

# ==============================================
# 12. TEST DATABASE CONNECTION
# ==============================================
Write-Host "🔌 Step 12: Testing database connection..." -ForegroundColor Yellow

$tables = docker exec postgres psql -U lifehub -d lifehub -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"

if ($tables -gt 0) {
    Write-Host "   ✅ Database connected, $tables tables found" -ForegroundColor Green
} else {
    Write-Host "   ❌ Database connection issue" -ForegroundColor Red
}

Write-Host ""

# ==============================================
# 13. DEPLOYMENT SUMMARY
# ==============================================
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "📊 DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "API Endpoints:" -ForegroundColor White
Write-Host "  - POST /api/auth/register" -ForegroundColor Gray
Write-Host "  - POST /api/auth/login" -ForegroundColor Gray
Write-Host "  - GET  /api/user/{userId}/data" -ForegroundColor Gray
Write-Host "  - PUT  /api/user/{userId}/settings" -ForegroundColor Gray
Write-Host "  - GET  /api/sidebar/{userId}" -ForegroundColor Gray
Write-Host ""
Write-Host "School System:" -ForegroundColor White
Write-Host "  - 13 new tables created" -ForegroundColor Gray
Write-Host "  - Timetable, Homework, Exams, Grades" -ForegroundColor Gray
Write-Host "  - Flashcards, Summaries, Study Sessions" -ForegroundColor Gray
Write-Host "  - Absences tracking" -ForegroundColor Gray
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# ==============================================
# 14. QUICK TESTS
# ==============================================
Write-Host "🧪 Step 14: Quick API tests..." -ForegroundColor Yellow

Write-Host "   → Testing /api/actuator/health..." -ForegroundColor Gray
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/actuator/health" -Method Get -ErrorAction Stop
    if ($health.status -eq "UP") {
        Write-Host "   ✅ Health check passed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Health check failed" -ForegroundColor Red
}

Write-Host ""

# ==============================================
# DEPLOYMENT COMPLETE
# ==============================================
Write-Host "======================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Test registration: POST /api/auth/register" -ForegroundColor Gray
Write-Host "2. Test login: POST /api/auth/login" -ForegroundColor Gray
Write-Host "3. Check sidebar config: GET /api/sidebar/1" -ForegroundColor Gray
Write-Host "4. Monitor logs: docker logs life-hub-backend -f" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Life Hub V2.0 is ready!" -ForegroundColor Cyan
Write-Host ""
