# Fix API Port - Change all localhost:8080 to localhost:5000 in frontend

Write-Host "Starte Port-Änderung von 8080 auf 5000..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "c:\Apps\Life Hub\frontend\src" -Recurse -Include *.tsx,*.ts | Where-Object { $_.FullName -notlike "*node_modules*" }

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($content -match "localhost:8080") {
        $newContent = $content -replace "localhost:8080", "localhost:5000"
        Set-Content $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "✓ $($file.Name)" -ForegroundColor Green
        $count++
    }
}

Write-Host "`n✅ $count Dateien aktualisiert!" -ForegroundColor Green
Write-Host "Backend läuft jetzt auf Port 5000" -ForegroundColor Yellow
