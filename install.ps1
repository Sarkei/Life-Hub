# =====================================================
# Life Hub - Quick Install Script
# Runs on NAS via SSH
# =====================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Life Hub - Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're on the NAS
Write-Host "[1/5] Checking environment..." -ForegroundColor Yellow
if (-not (Test-Path "/volume1")) {
    Write-Host "ERROR: Not running on NAS. Please run this script via SSH on your Synology NAS." -ForegroundColor Red
    exit 1
}

# Navigate to project directory
Write-Host "[2/5] Navigating to project directory..." -ForegroundColor Yellow
cd /volume1/docker/Life-Hub

# Install frontend dependencies
Write-Host "[3/5] Installing frontend dependencies..." -ForegroundColor Yellow
cd frontend
npm install react-syntax-highlighter @types/react-syntax-highlighter
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed." -ForegroundColor Red
    exit 1
}

# Run database migration
Write-Host "[4/5] Running database migration..." -ForegroundColor Yellow
cd ..
docker exec -i lifehub-db psql -U lifehub -d lifehub < backend/src/main/resources/db/migration/V1_0__notes_system_enhancement.sql
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Database migration might have failed. Check manually." -ForegroundColor Yellow
}

# Rebuild and restart containers
Write-Host "[5/5] Rebuilding Docker containers..." -ForegroundColor Yellow
docker-compose down
docker-compose build --no-cache backend frontend
docker-compose up -d

# Wait for containers to start
Write-Host ""
Write-Host "Waiting for containers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check container status
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Container Status:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker-compose ps

# Show logs
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Recent Logs:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker-compose logs --tail=20 backend

# Success message
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open browser: http://your-nas-ip:3000" -ForegroundColor White
Write-Host "2. Login with your account" -ForegroundColor White
Write-Host "3. Navigate to 'Notizen' in sidebar" -ForegroundColor White
Write-Host "4. Test folder creation and markdown editing" -ForegroundColor White
Write-Host ""
Write-Host "To view logs: docker-compose logs -f backend" -ForegroundColor Cyan
Write-Host "To restart: docker-compose restart" -ForegroundColor Cyan
Write-Host ""
