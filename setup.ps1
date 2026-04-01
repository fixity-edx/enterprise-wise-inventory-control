# Enterprise Inventory Management System - Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Enterprise Inventory Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to Backend
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location -Path "C:\Users\shaik\OneDrive\Desktop\Enterprise-wide-inventory-control\Backend"

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Navigate to Frontend
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
Set-Location -Path "C:\Users\shaik\OneDrive\Desktop\Enterprise-wide-inventory-control\Frontend"

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Backend (in one terminal):" -ForegroundColor White
Write-Host "   cd 'C:\Users\shaik\OneDrive\Desktop\Enterprise-wide-inventory-control\Backend'" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Frontend (in another terminal):" -ForegroundColor White
Write-Host "   cd 'C:\Users\shaik\OneDrive\Desktop\Enterprise-wide-inventory-control\Frontend'" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Then open http://localhost:3000 in your browser" -ForegroundColor Cyan
Write-Host ""
