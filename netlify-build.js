#!/usr/bin/env node

/**
 * Robust Netlify build script with fallbacks and error handling
 * This script tries different build approaches if the primary one fails
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Colored output for better visibility
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}🚀 Starting Netlify build process with enhanced error handling${colors.reset}`);

// Clean existing artifacts if any
try {
  console.log(`${colors.blue}Cleaning build artifacts...${colors.reset}`);
  if (fs.existsSync('dist')) {
    execSync('rimraf dist', { stdio: 'inherit' });
  }
  if (fs.existsSync('node_modules/.vite')) {
    execSync('rimraf node_modules/.vite', { stdio: 'inherit' });
  }
} catch (error) {
  console.log(`${colors.yellow}Warning: Cleanup step failed, continuing anyway${colors.reset}`);
}

// Build strategies in order of preference
const buildStrategies = [
  {
    name: 'Standard build',
    command: 'npm run build:safe'
  },
  {
    name: 'Legacy peer deps build',
    command: 'npm install --legacy-peer-deps && npm run build:safe'
  },
  {
    name: 'Minimal build without TypeScript checks',
    command: 'vite build --mode production --logLevel error'
  }
];

// Try each build strategy until one succeeds
let buildSuccess = false;

for (const strategy of buildStrategies) {
  console.log(`\n${colors.cyan}🛠️ Trying build strategy: ${strategy.name}${colors.reset}`);
  try {
    execSync(strategy.command, { stdio: 'inherit' });
    console.log(`\n${colors.green}✅ Build successful with strategy: ${strategy.name}${colors.reset}`);
    buildSuccess = true;
    break;
  } catch (error) {
    console.log(`\n${colors.red}❌ Build failed with strategy: ${strategy.name}${colors.reset}`);
    console.log(`${colors.yellow}Error: ${error.message}${colors.reset}`);
    console.log(`${colors.blue}Trying next build strategy...${colors.reset}`);
  }
}

if (!buildSuccess) {
  console.log(`\n${colors.red}❌ All build strategies failed. See logs above for details.${colors.reset}`);
  process.exit(1);
} else {
  console.log(`\n${colors.green}✅ Build completed successfully!${colors.reset}`);
  process.exit(0);
}
