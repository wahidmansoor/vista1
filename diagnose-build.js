#!/usr/bin/env node

/**
 * Build Diagnostic Script for OncoVista
 * Run this locally to identify potential build issues before deploying
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 OncoVista Build Diagnostics\n');

// Check Node.js and npm versions
console.log('📋 Environment Check:');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js: ${nodeVersion}`);
  console.log(`✅ npm: ${npmVersion}`);
  
  // Check if versions meet requirements
  const nodeMajor = parseInt(nodeVersion.substring(1).split('.')[0]);
  if (nodeMajor < 18) {
    console.log('⚠️  Warning: Node.js version should be 18+ for best compatibility');
  }
} catch (error) {
  console.log('❌ Error checking Node.js/npm versions:', error.message);
}

// Check critical files
console.log('\n📁 File Structure Check:');
const criticalFiles = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'src/main.tsx',
  'src/App.tsx',
  'netlify.toml'
];

let missingFiles = [];
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    missingFiles.push(file);
  }
});

// Check package.json integrity
console.log('\n📦 Package.json Analysis:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log(`✅ Name: ${packageJson.name}`);
  console.log(`✅ Version: ${packageJson.version}`);
  console.log(`✅ Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
  console.log(`✅ DevDependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
  
  // Check for build scripts
  const scripts = packageJson.scripts || {};
  const requiredScripts = ['build', 'build:simple', 'build:netlify'];
  
  console.log('\n🔧 Build Scripts Check:');
  requiredScripts.forEach(script => {
    if (scripts[script]) {
      console.log(`✅ ${script}: ${scripts[script]}`);
    } else {
      console.log(`❌ Missing script: ${script}`);
    }
  });
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check for common dependency issues
console.log('\n🔍 Dependency Analysis:');
try {
  // Check if node_modules exists
  if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules directory exists');
    
    // Check some critical dependencies
    const criticalDeps = ['react', 'vite', '@vitejs/plugin-react'];
    criticalDeps.forEach(dep => {
      if (fs.existsSync(`node_modules/${dep}`)) {
        console.log(`✅ ${dep} installed`);
      } else {
        console.log(`❌ ${dep} missing from node_modules`);
      }
    });
  } else {
    console.log('⚠️  node_modules directory not found - run npm install');
  }
} catch (error) {
  console.log('❌ Error checking dependencies:', error.message);
}

// Test build commands
console.log('\n🏗️  Build Command Test:');
const buildCommands = [
  'npm run type-check',
  'npm run build:simple'
];

for (const command of buildCommands) {
  try {
    console.log(`\n🔨 Testing: ${command}`);
    execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 60000 // 1 minute timeout
    });
    console.log(`✅ ${command} succeeded`);
  } catch (error) {
    console.log(`❌ ${command} failed:`);
    console.log(`   Exit code: ${error.status}`);
    console.log(`   Error: ${error.message}`);
    if (error.stdout) console.log(`   Output: ${error.stdout.slice(0, 200)}...`);
  }
}

// Environment variables check
console.log('\n🌍 Environment Variables:');
const envVars = [
  'VITE_SUPABASE_URL',
  'VITE_AUTH0_DOMAIN',
  'VITE_AUTH0_CLIENT_ID'
];

envVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    console.log(`⚠️  ${envVar} not set (okay for build)`);
  }
});

// Summary
console.log('\n📊 Summary:');
if (missingFiles.length === 0) {
  console.log('✅ All critical files present');
} else {
  console.log(`❌ Missing files: ${missingFiles.join(', ')}`);
}

console.log('\n🚀 Recommendations:');
console.log('1. If npm ci fails, try: npm install --legacy-peer-deps');
console.log('2. For memory issues, ensure NODE_OPTIONS="--max-old-space-size=4096"');
console.log('3. For Netlify, use: npm install instead of npm ci');
console.log('4. Consider using build:netlify script for production');
console.log('\n✨ Build diagnostic complete!');
