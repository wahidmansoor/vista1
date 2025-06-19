#!/usr/bin/env node

/**
 * Simplified Netlify Build Script
 * A more reliable approach than the complex fallback system
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify Build Process');

// Clean output directory
try {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('✅ Cleaned dist directory');
  }
} catch (error) {
  console.log(`⚠️ Warning: Could not clean dist directory: ${error.message}`);
}

// Ensure critical files exist
const criticalFiles = [
  'src/main.tsx',
  'src/App.tsx', 
  'vite.config.ts',
  'package.json'
];

console.log('🔍 Verifying critical files...');
const missingFiles = criticalFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error('❌ Missing critical files:', missingFiles.join(', '));
  process.exit(1);
}

console.log('✅ All critical files present');

// Create design-tokens.css if missing
const designTokensPath = 'src/styles/design-tokens.css';
const designTokensDir = path.dirname(designTokensPath);

if (!fs.existsSync(designTokensDir)) {
  fs.mkdirSync(designTokensDir, { recursive: true });
}

if (!fs.existsSync(designTokensPath)) {
  console.log('🎨 Creating design-tokens.css...');
  const designTokensContent = `/* OncoVista Design Token System */
:root {
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --space-md: 1rem;
  --space-lg: 1.5rem;
}`;
  fs.writeFileSync(designTokensPath, designTokensContent);
  console.log('✅ Created design-tokens.css');
}

// Build the application
try {
  console.log('📦 Building application...');
  
  // Try the standard build first
  try {
    execSync('npm run build:direct-no-check', { stdio: 'inherit' });
    console.log('🎉 Build successful!');
  } catch (error) {
    console.log('⚠️ Standard build failed, trying minimal build...');
    execSync('npm run build:minimal', { stdio: 'inherit' });
    console.log('🎉 Minimal build successful!');
  }
  
  // Verify build output
  if (!fs.existsSync('dist/index.html')) {
    throw new Error('Build output missing - no index.html found in dist/');
  }
  
  console.log('✅ Build verification passed');
  process.exit(0);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
