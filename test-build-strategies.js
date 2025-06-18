#!/usr/bin/env node

/**
 * Local Build Test Script
 * Tests different build strategies to find what works
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log('🧪 Testing Build Strategies Locally\n');

const buildStrategies = [
  {
    name: 'Strategy 1: npm install + build:netlify',
    commands: [
      'npm install --prefer-offline --no-audit',
      'npm run build:netlify'
    ]
  },
  {
    name: 'Strategy 2: npm install --legacy-peer-deps + build:simple',
    commands: [
      'npm install --legacy-peer-deps --no-optional',
      'npm run build:simple'
    ]
  },
  {
    name: 'Strategy 3: Clear cache + fresh install',
    commands: [
      'npm cache clean --force',
      'npm install',
      'npm run build:simple'
    ]
  },
  {
    name: 'Strategy 4: Production build with type check',
    commands: [
      'npm install --production=false',
      'npm run type-check',
      'npm run build'
    ]
  }
];

async function testStrategy(strategy) {
  console.log(`\n🔨 Testing: ${strategy.name}`);
  console.log('━'.repeat(50));
  
  // Clean dist folder first
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning dist folder...');
    try {
      execSync('rmdir /s /q dist', { stdio: 'pipe' });
    } catch (e) {
      // Ignore errors, folder might not exist
    }
  }
  
  for (let i = 0; i < strategy.commands.length; i++) {
    const command = strategy.commands[i];
    console.log(`\n📝 Step ${i + 1}: ${command}`);
    
    try {
      const start = Date.now();
      execSync(command, { 
        encoding: 'utf8', 
        stdio: 'inherit',
        timeout: 300000 // 5 minutes
      });
      const duration = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`✅ Completed in ${duration}s`);
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      console.log(`   Exit code: ${error.status}`);
      return false;
    }
  }
  
  // Check if build succeeded
  if (fs.existsSync('dist/index.html')) {
    console.log('✅ Build artifacts created successfully');
    
    // Check build size
    try {
      const stats = fs.statSync('dist');
      console.log(`📊 Build output created`);
      return true;
    } catch (e) {
      console.log('⚠️  Could not check build size');
      return true;
    }
  } else {
    console.log('❌ Build artifacts not found');
    return false;
  }
}

async function runTests() {
  console.log('Starting build strategy tests...\n');
  
  const results = [];
  
  for (const strategy of buildStrategies) {
    const success = await testStrategy(strategy);
    results.push({
      name: strategy.name,
      success
    });
    
    if (success) {
      console.log(`\n🎉 ${strategy.name} SUCCEEDED!`);
      break; // Stop on first success
    } else {
      console.log(`\n💥 ${strategy.name} FAILED`);
    }
    
    console.log('\n' + '═'.repeat(70));
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('━'.repeat(50));
  
  results.forEach(result => {
    const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
    console.log(`${status} - ${result.name}`);
  });
  
  const successful = results.find(r => r.success);
  if (successful) {
    console.log(`\n🏆 Recommended strategy: ${successful.name}`);
    console.log('\nNext steps:');
    console.log('1. Update your netlify.toml with the successful build command');
    console.log('2. Commit and push your changes');
    console.log('3. Trigger a new Netlify deployment');
  } else {
    console.log('\n⚠️  All strategies failed. Check the errors above.');
    console.log('\nTroubleshooting steps:');
    console.log('1. Check Node.js version compatibility');
    console.log('2. Clear node_modules and reinstall');
    console.log('3. Check for platform-specific dependency issues');
  }
}

// Run the tests
runTests().catch(console.error);
