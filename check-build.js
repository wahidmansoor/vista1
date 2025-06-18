#!/usr/bin/env node

// Enhanced build verification script
console.log('🔍 Checking build prerequisites...');

// Check if critical files exist
const fs = require('fs');
const path = require('path');

// Determine if we're doing a simple build
const isSimpleBuild = process.argv.includes('--simple') || 
                     process.env.npm_lifecycle_event === 'build:simple' ||
                     process.env.npm_lifecycle_event === 'build:simple-fallback';

// Define critical files based on build type
const criticalFiles = isSimpleBuild ?
  [
    'simple/index.html',
    'simple/app.js',
    'simple/style.css',
    'vite.config.ts',
    'tsconfig.json',
    'package.json'
  ] : 
  [
    'src/main.tsx',
    'src/App.tsx',
    'vite.config.ts',
    'tsconfig.json',
    'package.json'
  ];

console.log(`🔍 Running ${isSimpleBuild ? 'simple' : 'full'} build check`);

let allFilesExist = true;

criticalFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing critical file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// Check Node.js version compatibility
const nodeVersion = process.versions.node;
const nodeMajor = parseInt(nodeVersion.split('.')[0], 10);
if (nodeMajor < 18) {
  console.warn(`⚠️ Warning: Node.js v${nodeVersion} detected. Version 18+ recommended.`);
}

if (allFilesExist) {
  console.log('✅ All critical files present');
  console.log(`🚀 Ready for ${isSimpleBuild ? 'simple' : 'full'} build!`);
  process.exit(0);
} else {
  console.error('❌ Build prerequisites not met');
  process.exit(1);
}
