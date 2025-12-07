@echo off
echo Starting TruEstate backend (dev)...
REM Move to backend root and run dev script
cd /d "%~dp0\.."
npm run dev
