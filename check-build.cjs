#!/usr/bin/env node

// Simple CommonJS build check script
console.log('🔍 Checking build prerequisites...');

// Check if critical files exist
const fs = require('fs');
const path = require('path');

// Define critical files based on build type
const criticalFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'vite.config.ts',
  'tsconfig.json',
  'package.json'
];

console.log('🔍 Running full build check');

let allFilesExist = true;

criticalFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing critical file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

if (allFilesExist) {
  console.log('✅ All critical files present');
  console.log('🚀 Ready for build!');
  process.exit(0);
} else {
  console.error('❌ Build prerequisites not met');
  process.exit(1);
}
