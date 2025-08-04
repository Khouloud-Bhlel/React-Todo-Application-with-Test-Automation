@echo off
REM Release script for GitHub Packages (Windows)
REM Usage: release.bat [version]

SET VERSION=%1
IF "%VERSION%"=="" SET VERSION=patch

echo 🚀 Starting release process...

REM Ensure we're on master branch
echo 📋 Checking git status...
git checkout master
git pull origin master

REM Update version
echo 📦 Updating version...
npm version %VERSION%

REM Build the package
echo 🔨 Building package...
npm run build-package

REM Push changes and tags
echo 📤 Pushing to GitHub...
git push origin master --follow-tags

echo ✅ Release complete! GitHub Actions will handle the publishing.
echo 🔗 Check https://github.com/Khouloud-Bhlel/React-Todo-Application-with-Test-Automation/actions
