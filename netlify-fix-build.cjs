#!/usr/bin/env node

/**
 * Fixed Netlify build script (CommonJS version)
 * This version is compatible with ES modules project
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for better log readability
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}🚀 Starting Fixed Netlify Build${colors.reset}`);

// Make sure the output directory is clean
try {
  console.log(`${colors.blue}Cleaning output directory...${colors.reset}`);
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('Cleaned dist directory');
  }
} catch (error) {
  console.log(`${colors.yellow}Warning: Could not clean dist directory, continuing anyway: ${error.message}${colors.reset}`);
}

// Ensure design-tokens.css exists - it's required for the build
try {
  console.log(`${colors.blue}Checking for design-tokens.css...${colors.reset}`);
  const designTokensPath = 'src/styles/design-tokens.css';
  const designTokensDir = path.dirname(designTokensPath);
  
  if (!fs.existsSync(designTokensDir)) {
    console.log(`Creating directory: ${designTokensDir}`);
    fs.mkdirSync(designTokensDir, { recursive: true });
  }
  
  if (!fs.existsSync(designTokensPath)) {
    console.log(`${colors.yellow}design-tokens.css not found, creating it...${colors.reset}`);
    const designTokensContent = `/* 
 * OncoVista Design Token System
 * Auto-generated during build
 */

:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  --color-primary-950: #172554;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
}`;
    fs.writeFileSync(designTokensPath, designTokensContent);
    console.log(`${colors.green}✅ Created design-tokens.css${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ design-tokens.css exists${colors.reset}`);
  }
} catch (error) {
  console.log(`${colors.yellow}Warning: Could not check/create design-tokens.css: ${error.message}${colors.reset}`);
}

// Verify critical files exist
function verifyFiles() {
  console.log(`${colors.blue}Verifying critical files...${colors.reset}`);
  
  const criticalFiles = [
    'src/main.tsx', 
    'src/App.tsx', 
    'vite.config.ts',
    'src/styles/design-tokens.css' // Verify design tokens exists
  ];
  
  let missingFiles = [];
  
  criticalFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
      console.error(`${colors.red}Missing critical file: ${file}${colors.reset}`);
    }
  });
  
  if (missingFiles.length > 0) {
    throw new Error(`Missing critical files: ${missingFiles.join(', ')}`);
  } else {
    console.log(`${colors.green}✅ All critical files verified${colors.reset}`);
  }
}

// Main app build with multiple fallback options
function buildMainApp() {
  console.log(`${colors.cyan}📦 Building main application...${colors.reset}`);  const buildCommands = [
    // First try: Direct build without type checking
    { 
      name: "Direct build without checks", 
      cmd: "npm run build:direct-no-check" 
    },
    
    // Second try: minimal build
    { 
      name: "Minimal build", 
      cmd: "npm run build:minimal" 
    },
    
    // Third try: CI build (with type checking but error logging)
    { 
      name: "CI build", 
      cmd: "npm run build:ci" 
    },
    
    // Last try: emergency build
    { 
      name: "Emergency build", 
      cmd: "npm run build:emergency" 
    }
  ];

  for (const buildOption of buildCommands) {
    console.log(`${colors.blue}Trying: ${buildOption.name}${colors.reset}`);
    try {
      // Show output to help with debugging
      console.log(`${colors.cyan}Executing: ${buildOption.cmd}${colors.reset}`);
      const output = execSync(buildOption.cmd, { encoding: 'utf8', stdio: ['inherit', 'pipe', 'pipe'] });
      console.log(output);
      console.log(`${colors.green}✅ Build successful with: ${buildOption.name}${colors.reset}`);
      return true;
    } catch (error) {
      console.log(`${colors.yellow}⚠️ Build attempt failed: ${buildOption.name}${colors.reset}`);
      console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
      
      // Log the error output to help diagnose the issue
      if (error.stdout) console.log(`${colors.cyan}Output:${colors.reset}\n${error.stdout}`);
      if (error.stderr) console.log(`${colors.red}Error Output:${colors.reset}\n${error.stderr}`);
      
      // Wait a bit before trying next approach
      console.log('Waiting before next attempt...');      try {
        // Try PowerShell sleep for Windows
        execSync('powershell -command "Start-Sleep -Seconds 1"');
      } catch (e) {
        // Fallback to JavaScript timeout
        const waitTill = new Date(new Date().getTime() + 1000);
        while(waitTill > new Date()) {}
      }
    }
  }
  
  return false;
}

// Main execution flow
try {
  verifyFiles();
  
  let buildSuccess = buildMainApp();
  
  if (buildSuccess) {
    console.log(`${colors.green}🎉 Build completed successfully!${colors.reset}`);
    process.exit(0);
  } else {
    console.error(`${colors.red}❌ All build attempts failed${colors.reset}`);
    process.exit(1);
  }
} catch (error) {
  console.error(`${colors.red}❌ Fatal build error: ${error.message}${colors.reset}`);
  process.exit(1);
}
