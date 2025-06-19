#!/usr/bin/env node

/**
 * Test script for Netlify build process
 * Run this locally to verify the build script works before deploying
 */

console.log("Starting local Netlify build test...");

const { execSync } = require('child_process');

try {
  // Clean any previous dist directory
  console.log("Cleaning dist directory...");
  execSync("rimraf dist", { stdio: 'inherit' });
  
  // Run the build script
  console.log("Running build script...");
  execSync("node netlify-robust-build.js", { stdio: 'inherit' });
  
  console.log("✅ Build test completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("❌ Build test failed:", error.message);
  process.exit(1);
}
