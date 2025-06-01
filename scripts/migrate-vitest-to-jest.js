// Migration script to replace Vitest imports and API calls with Jest equivalents
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility to get all test files recursively
function getAllTestFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllTestFiles(filePath, fileList);
    } else if (
      file.endsWith('.test.ts') ||
      file.endsWith('.test.tsx') ||
      file.endsWith('.test.js') ||
      file.endsWith('.test.jsx') ||
      file.endsWith('.spec.ts') ||
      file.endsWith('.spec.tsx') ||
      file.endsWith('.spec.js') ||
      file.endsWith('.spec.jsx')
    ) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Main migration function
function migrateVitestToJest(filePath) {
  console.log(`Processing ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Vitest imports
  content = content.replace(
    /import\s+{([^}]*)}\s+from\s+['"]vitest['"]/g,
    (match, imports) => {
      // Skip the whole import if it only contains vitest-specific imports
      if (imports.split(',').every(i => 
        i.trim() === 'vi' || 
        i.includes('SpyInstance') || 
        i.includes('MockInstance')
      )) {
        return '// Vitest import removed';
      }
      
      // Otherwise, we just keep the imports that Jest provides globally
      return '// Jest globals used: ' + imports.trim();
    }
  );

  // Replace vi.mock with jest.mock
  content = content.replace(/vi\.mock/g, 'jest.mock');

  // Replace vi.fn with jest.fn
  content = content.replace(/vi\.fn/g, 'jest.fn');

  // Replace vi.spyOn with jest.spyOn
  content = content.replace(/vi\.spyOn/g, 'jest.spyOn');

  // Replace vi.clearAllMocks with jest.clearAllMocks
  content = content.replace(/vi\.clearAllMocks/g, 'jest.clearAllMocks');

  // Replace vi.resetAllMocks with jest.resetAllMocks
  content = content.replace(/vi\.resetAllMocks/g, 'jest.resetAllMocks');

  // Replace vi.restoreAllMocks with jest.restoreAllMocks
  content = content.replace(/vi\.restoreAllMocks/g, 'jest.restoreAllMocks');

  // Replace vi.setConfig with jest.setTimeout for test timeout
  content = content.replace(/vi\.setConfig\(\s*{\s*testTimeout:\s*(\d+)\s*}\s*\)/g, 'jest.setTimeout($1)');

  // Replace vi.stubGlobal calls with direct property assignment
  content = content.replace(
    /vi\.stubGlobal\(\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\s*\)/g,
    'Object.defineProperty(global, \'$1\', { value: $2, writable: true })'
  );

  // Replace mocked utility
  content = content.replace(/vi\.mocked/g, 'jest.mocked');

  // Write back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Migrated ${filePath}`);
}

// Main execution
console.log('Starting Vitest to Jest migration...');
const srcDir = path.resolve(__dirname, '../src');

if (!fs.existsSync(srcDir)) {
  console.error(`Source directory not found: ${srcDir}`);
  process.exit(1);
}

const testFiles = getAllTestFiles(srcDir);
console.log(`Found ${testFiles.length} test files to process.`);

testFiles.forEach(migrateVitestToJest);

// Check if vitest.config.ts exists and delete it
const vitestConfigPath = path.resolve(__dirname, '../vitest.config.ts');
if (fs.existsSync(vitestConfigPath)) {
  console.log(`Removing ${vitestConfigPath}...`);
  fs.unlinkSync(vitestConfigPath);
  console.log('✅ Removed vitest.config.ts');
}

console.log('Migration complete!');
