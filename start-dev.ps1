# CraftConnect Development Startup Script
# This script starts both backend and frontend servers

Write-Host "`n╔═══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     CraftConnect Development Mode    ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if backend dependencies are installed
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✅ Backend dependencies installed`n" -ForegroundColor Green
}

# Check if frontend dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Frontend dependencies installed`n" -ForegroundColor Green
}

Write-Host "🚀 Starting servers...`n" -ForegroundColor Green

# Start backend in a new window
Write-Host "📡 Starting Backend API (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

Start-Sleep -Seconds 2

# Start frontend in a new window
Write-Host "🎨 Starting Frontend App (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "`n╔═══════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         Servers Started! 🎉          ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📱 Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔌 Backend:   http://localhost:5000" -ForegroundColor Cyan
Write-Host "💚 Health:    http://localhost:5000/api/health`n" -ForegroundColor Cyan

Write-Host "📝 Two new PowerShell windows have opened:" -ForegroundColor White
Write-Host "   1. Backend API Server" -ForegroundColor Gray
Write-Host "   2. Frontend React App`n" -ForegroundColor Gray

Write-Host "⚠️  To stop servers: Close the PowerShell windows or press Ctrl+C in each`n" -ForegroundColor Yellow

Write-Host "✨ Happy coding!`n" -ForegroundColor Magenta
