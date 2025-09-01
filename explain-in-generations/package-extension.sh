#!/bin/bash

# Chrome Extension Packaging Script
# This script packages the extension for Chrome Web Store submission

set -e

echo "🚀 Starting Chrome Extension packaging..."

# Ensure we're in the right directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Build the extension
echo "📦 Building extension..."
npm run build

# Create a clean package directory
PACKAGE_DIR="./chrome-extension-package"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Copy dist files to package directory
echo "📋 Copying extension files..."
cp -r dist/* "$PACKAGE_DIR/"

# Remove source maps and unnecessary files for production
echo "🧹 Cleaning up production files..."
find "$PACKAGE_DIR" -name "*.map" -delete
find "$PACKAGE_DIR" -name "*.ts" -delete
find "$PACKAGE_DIR" -name "*.tsx" -delete

# Create collected_extensions directory for organized storage
COLLECTED_DIR="./collected_extensions"
mkdir -p "$COLLECTED_DIR"

# Create ZIP file for Chrome Web Store
EXTENSION_NAME="explain-in-generations"
VERSION=$(node -p "require('./package.json').version")
ZIP_NAME="${EXTENSION_NAME}-v${VERSION}.zip"
ZIP_PATH="$COLLECTED_DIR/$ZIP_NAME"

echo "🗜️  Creating ZIP file: $ZIP_NAME"
cd "$PACKAGE_DIR"
zip -r "../$ZIP_PATH" ./*
cd ..

echo "✅ Extension packaged successfully!"
echo "📁 Package directory: $PACKAGE_DIR"
echo "📦 ZIP file: $ZIP_PATH"
echo ""
echo "Next steps:"
echo "1. Test the extension by loading the unpacked extension from: $PACKAGE_DIR"
echo "2. Upload $ZIP_PATH to Chrome Web Store Developer Dashboard"
echo "3. Follow the Chrome Web Store submission guidelines"

# Display package contents
echo ""
echo "📋 Package contents:"
ls -la "$PACKAGE_DIR"