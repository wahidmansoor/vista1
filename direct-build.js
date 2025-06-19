#!/usr/bin/env node

/**
 * Direct Vite build script - simplest possible approach
 */

import { execSync } from 'child_process';
import * as fs from 'fs';

// Basic colors for minimal output
const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

try {
  console.log('🚀 Starting direct Vite build...');
  
  // Clean output directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('Cleaned dist directory');
  }
  
  // Run Vite build directly with minimal options
  execSync('vite build --mode production', { stdio: 'inherit' });
  
  console.log(`${green}✅ Build completed successfully!${reset}`);
  process.exit(0);
} catch (error) {
  console.error(`${red}❌ Build failed: ${error.message}${reset}`);
  
  // Try minimal fallback without TypeScript checks
  try {
    console.log('Attempting minimal fallback build...');
    execSync('vite build --mode production --logLevel error', { stdio: 'inherit' });
    console.log(`${green}✅ Fallback build completed successfully!${reset}`);
    process.exit(0);
  } catch (fallbackError) {
    console.error(`${red}❌ All build attempts failed${reset}`);
    process.exit(1);
  }
}
