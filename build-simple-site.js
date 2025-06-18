#!/usr/bin/env node

/**
 * Simple build script - optimized for building just the simple site
 * This script handles errors specific to the simple site build
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.blue}🔍 Simple Site Build Script${colors.reset}`);

// Verify simple folder exists
const simpleDir = path.join(process.cwd(), 'simple');
if (!fs.existsSync(simpleDir)) {
  console.error(`${colors.red}❌ 'simple' directory not found!${colors.reset}`);
  process.exit(1);
}

// Check critical files
const requiredFiles = ['index.html', 'app.js', 'style.css'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(simpleDir, file)));

if (missingFiles.length > 0) {
  console.error(`${colors.red}❌ Missing required files in simple directory: ${missingFiles.join(', ')}${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.green}✅ All simple site files verified${colors.reset}`);

// Try building with various approaches
try {
  console.log(`${colors.blue}🚀 Building simple site...${colors.reset}`);
  
  // Ensure dist directory is clean
  if (fs.existsSync('dist')) {
    execSync('rimraf dist', { stdio: 'inherit' });
    console.log(`${colors.yellow}♻️ Cleaned existing dist directory${colors.reset}`);
  }
  
  // Try the build
  try {
    execSync('npm run build:simple', { stdio: 'inherit' });
    console.log(`${colors.green}✅ Simple site built successfully!${colors.reset}`);
    process.exit(0);
  } catch (buildError) {
    console.log(`${colors.yellow}⚠️ Standard build failed, trying fallback approach...${colors.reset}`);
    
    // Try with legacy peer deps
    try {
      execSync('npm run build:simple-fallback', { stdio: 'inherit' });
      console.log(`${colors.green}✅ Simple site built successfully with fallback!${colors.reset}`);
      process.exit(0);
    } catch (fallbackError) {
      console.error(`${colors.red}❌ All build attempts failed${colors.reset}`);
      console.error(fallbackError.message);
      process.exit(1);
    }
  }
} catch (error) {
  console.error(`${colors.red}❌ Build error: ${error.message}${colors.reset}`);
  process.exit(1);
}
