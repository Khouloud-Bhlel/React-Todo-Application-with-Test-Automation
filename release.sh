#!/bin/bash

# Release script for GitHub Packages
# Usage: ./release.sh [version]

set -e

VERSION=${1:-patch}

echo "🚀 Starting release process..."

# Ensure we're on main branch
echo "📋 Checking git status..."
git checkout main
git pull origin main

# Update version
echo "📦 Updating version..."
npm version $VERSION

# Build the package
echo "🔨 Building package..."
npm run build-package

# Push changes and tags
echo "📤 Pushing to GitHub..."
git push origin main --follow-tags

echo "✅ Release complete! GitHub Actions will handle the publishing."
echo "🔗 Check https://github.com/Khouloud-Bhlel/React-Todo-Application-with-Test-Automation/actions"
