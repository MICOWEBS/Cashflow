#!/bin/bash

# Exit on error
set -e

# Install dependencies
npm install

# Build the application
npm run build

# Create a deployment directory
mkdir -p deploy

# Copy necessary files
cp -r .next deploy/
cp -r public deploy/
cp -r node_modules deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp .env.production deploy/.env
cp next.config.ts deploy/

# Create a zip file
cd deploy
zip -r ../deploy.zip ./*
cd ..

# Clean up
rm -rf deploy

echo "Deployment package created: deploy.zip" 