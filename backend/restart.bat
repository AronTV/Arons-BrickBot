@echo off
taskkill /f /im node.exe
cd backend
node server.js
pause