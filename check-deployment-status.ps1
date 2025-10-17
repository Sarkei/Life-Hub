# Script to help check deployment status on NAS
# Run this on your NAS to verify the fix was deployed

Write-Host "=== Life Hub Deployment Status Check ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run these commands on your NAS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Check if git pulled the latest changes:" -ForegroundColor Green
Write-Host "   cd /volume1/docker/Life-Hub && git log --oneline -1"
Write-Host ""
Write-Host "2. Check if backend container was rebuilt:" -ForegroundColor Green  
Write-Host "   docker ps --filter name=backend --format 'table {{.Names}}\t{{.Status}}\t{{.CreatedAt}}'"
Write-Host ""
Write-Host "3. Check backend logs for JWT errors:" -ForegroundColor Green
Write-Host "   docker logs life-hub-backend-1 --tail 50 | grep -i 'jwt\|error\|login'"
Write-Host ""
Write-Host "4. Force rebuild backend if needed:" -ForegroundColor Green
Write-Host "   cd /volume1/docker/Life-Hub && docker-compose build --no-cache backend && docker-compose up -d backend"
Write-Host ""
Write-Host "Expected result after fix:" -ForegroundColor Cyan
Write-Host "  - No more 'Illegal base64 character' errors"
Write-Host "  - Login should succeed and return JWT token"
Write-Host "  - Backend container created time should be recent"
Write-Host ""
