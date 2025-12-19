# CraftConnect Development Restart Script

Write-Host "🔄 Restarting CraftConnect Development Environment..." -ForegroundColor Cyan

# Kill any existing Node processes that might be using our ports
Write-Host "🛑 Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment for processes to fully stop
Start-Sleep -Seconds 2

# Check if ports are free
Write-Host "🔍 Checking port availability..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "⚠️  Port 5000 is still in use. You may need to manually stop the process." -ForegroundColor Red
}

if ($port5173) {
    Write-Host "⚠️  Port 5173 is still in use. You may need to manually stop the process." -ForegroundColor Red
}

Write-Host "✅ Ready to start development servers!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open a terminal and run: cd backend && npm start" -ForegroundColor White
Write-Host "2. Open another terminal and run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Green