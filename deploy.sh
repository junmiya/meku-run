#!/bin/bash

# Firebase Word Card App - Manual Deploy Script
# Usage: ./deploy.sh [path-to-service-account.json]

set -e

echo "🚀 Firebase Word Card App - Manual Deploy"
echo "=========================================="

# Check if service account file is provided
if [ -z "$1" ]; then
    echo "❌ Error: Service account JSON file path required"
    echo "Usage: ./deploy.sh [path-to-service-account.json]"
    exit 1
fi

SERVICE_ACCOUNT_FILE="$1"

# Check if service account file exists
if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo "❌ Error: Service account file not found: $SERVICE_ACCOUNT_FILE"
    exit 1
fi

# Set up Firebase authentication
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_FILE"

echo "1. Installing dependencies..."
npm ci

echo "2. Building Next.js application..."
npm run build

echo "3. Verifying build output..."
if [ ! -d "out" ]; then
    echo "❌ Error: Build output directory 'out' not found"
    exit 1
fi

echo "4. Installing Firebase CLI..."
npm install -g firebase-tools

echo "5. Deploying to Firebase Hosting..."
firebase deploy --project meku-run --only hosting --debug

echo "✅ Deployment completed successfully!"
echo "🌐 Your app is now available at: https://meku-run.web.app"