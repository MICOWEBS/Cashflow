@echo off

REM Install dependencies
call npm install

REM Build the application
call npm run build

REM Create a deployment directory
if not exist deploy mkdir deploy

REM Copy necessary files
xcopy /E /I /Y .next deploy\.next
xcopy /E /I /Y public deploy\public
xcopy /E /I /Y node_modules deploy\node_modules
copy /Y package.json deploy\
copy /Y package-lock.json deploy\
copy /Y .env.production deploy\.env
copy /Y next.config.ts deploy\

REM Create a zip file
cd deploy
powershell Compress-Archive -Path * -DestinationPath ..\deploy.zip -Force
cd ..

REM Clean up
rmdir /S /Q deploy

echo Deployment package created: deploy.zip 