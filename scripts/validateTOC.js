import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths configuration for medical oncology handbook
const TOC_PATH = path.join(__dirname, '../public/medical_oncology_handbook/toc.json');
const HANDBOOK_DIR = path.join(__dirname, '../public/medical_oncology_handbook');

// Read and validate TOC
function validateTOC(tocData) {
  const report = {
    found: new Set(),
    missing: new Set(),
    invalid: new Set()
  };

  function processEntry(entry) {
    try {
      if (entry.path) {
        const fullPath = path.join(HANDBOOK_DIR, `${entry.path}.md`);
        if (fs.existsSync(fullPath)) {
          report.found.add(entry.path);
        } else {
          report.missing.add(entry.path);
        }
      }

      if (entry.items) {
        entry.items.forEach(item => processEntry(item));
      }
    } catch (err) {
      report.invalid.add(entry.path || 'Unknown path');
      console.error(`Error processing entry: ${err.message}`);
    }
  }

  tocData.forEach(entry => processEntry(entry));
  return report;
}

// Find extra files not in TOC
function findExtraFiles(report) {
  const extraFiles = new Set();
  
  function walkDir(dir, baseDir = HANDBOOK_DIR) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        try {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            walkDir(fullPath, baseDir);
          } else if (file.endsWith('.md')) {
            const relativePath = path.relative(baseDir, fullPath)
              .replace(/\.md$/, '')
              .replace(/\\/g, '/');
            
            if (!report.found.has(relativePath)) {
              extraFiles.add(relativePath);
            }
          }
        } catch (err) {
          console.error(`Error processing file ${file}: ${err.message}`);
        }
      });
    } catch (err) {
      console.error(`Error reading directory ${dir}: ${err.message}`);
    }
  }

  walkDir(HANDBOOK_DIR);
  return extraFiles;
}

// Print report with colors
function printReport(report, extraFiles) {
  console.log('\nMedical Oncology Handbook TOC Validation\n' + '='.repeat(40));
  
  console.log('\n✅ Found Files:');
  [...report.found].sort().forEach(file => {
    console.log(chalk.green(`  ✓ ${file}`));
  });

  console.log('\n❌ Missing Files:');
  [...report.missing].sort().forEach(file => {
    console.log(chalk.red(`  ✗ ${file}`));
  });

  console.log('\n⚠️ Invalid Paths:');
  [...report.invalid].sort().forEach(file => {
    console.log(chalk.yellow(`  ! ${file}`));
  });

  console.log('\n📄 Extra Files:');
  [...extraFiles].sort().forEach(file => {
    console.log(chalk.blue(`  + ${file}`));
  });

  console.log('\nSummary:');
  console.log(`Total Referenced: ${report.found.size + report.missing.size}`);
  console.log(`Found: ${chalk.green(report.found.size)}`);
  console.log(`Missing: ${chalk.red(report.missing.size)}`);
  console.log(`Invalid: ${chalk.yellow(report.invalid.size)}`);
  console.log(`Extra: ${chalk.blue(extraFiles.size)}`);
}

// Main execution
try {
  const tocContent = fs.readFileSync(TOC_PATH, 'utf8');
  const tocData = JSON.parse(tocContent);
  const report = validateTOC(tocData);
  const extraFiles = findExtraFiles(report);
  printReport(report, extraFiles);
} catch (err) {
  console.error(chalk.red('\nError:'), err.message);
  process.exit(1);
}