@echo off

cd frontend
echo Building frontend
call npm run build

if errorlevel 1 (
    echo build failed
    exit /b 1
)

echo Prettier check
call npm run prettier:check

if errorlevel 1 (
    echo Prettier check failed
    exit /b 1
)

cd ../backend

echo building backend
call npm run build

if errorlevel 1 (
    echo build failed
    exit /b 1
)