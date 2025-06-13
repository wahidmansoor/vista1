/**
 * Migration script to transfer handbook content from local files to Supabase
 * This script reads .md and .json files from the public handbook directories
 * and uploads them to the handbook_files table in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL === 'your-supabase-url') {
  console.error('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Handbook sections and their directories
const HANDBOOK_SECTIONS = [
  {
    id: 'medical-oncology',
    name: 'Medical Oncology',
    directory: 'medical_oncology_handbook'
  },
  {
    id: 'palliative',
    name: 'Palliative Care',
    directory: 'palliative_handbook'
  },
  {
    id: 'radiation',
    name: 'Radiation Oncology',
    directory: 'radiation_handbook'
  }
];

/**
 * Extract title from content based on format
 */
function extractTitle(content, format, filename) {
  if (format === 'markdown') {
    // Try to extract from frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const titleMatch = frontmatterMatch[1].match(/title:\s*(.+)/);
      if (titleMatch) {
        return titleMatch[1].trim().replace(/['"]/g, '');
      }
    }
    
    // Try to extract from first heading
    const headingMatch = content.match(/^#\s+(.+)/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
  } else if (format === 'json') {
    try {
      const json = JSON.parse(content);
      if (json.title) return json.title;
      if (json.name) return json.name;
    } catch (err) {
      console.warn(`Failed to parse JSON for title extraction: ${filename}`);
    }
  }
  
  // Fallback to filename
  return filename
    .replace(/\.(md|json)$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Generate topic identifier from file path
 */
function generateTopicId(relativePath, sectionDirectory) {
  return relativePath
    .replace(new RegExp(`^${sectionDirectory}/`), '')
    .replace(/\.(md|json)$/, '')
    .replace(/\\/g, '/'); // Normalize path separators
}

/**
 * Recursively scan directory for handbook files
 */
function scanDirectory(dirPath, baseDir = dirPath) {
  const files = [];
  
  if (!fs.existsSync(dirPath)) {
    console.warn(`⚠️ Directory not found: ${dirPath}`);
    return files;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      files.push(...scanDirectory(fullPath, baseDir));
    } else if (entry.isFile() && /\.(md|json)$/.test(entry.name)) {
      // Skip special files
      if (['toc.json', 'toc.md', 'overview.json', 'overview.md'].includes(entry.name)) {
        console.log(`⏭️ Skipping special file: ${relativePath}`);
        continue;
      }
      
      files.push({
        fullPath,
        relativePath,
        filename: entry.name,
        format: entry.name.endsWith('.md') ? 'markdown' : 'json'
      });
    }
  }
  
  return files;
}

/**
 * Upload a single file to Supabase
 */
async function uploadFile(section, file) {
  try {
    console.log(`📄 Processing: ${file.relativePath}`);
    
    // Read file content
    const content = fs.readFileSync(file.fullPath, 'utf-8');
    
    // Extract title
    const title = extractTitle(content, file.format, file.filename);
    
    // Generate topic ID
    const topic = generateTopicId(file.relativePath, section.directory);
    
    // Prepare record
    const record = {
      section: section.id,
      topic,
      title,
      content,
      format: file.format,
      path: `/${section.id}/${topic}`
    };
    
    console.log(`  📝 Title: "${title}"`);
    console.log(`  🏷️ Topic: "${topic}"`);
    console.log(`  📋 Format: ${file.format}`);
    console.log(`  📏 Content length: ${content.length} characters`);
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('handbook_files')
      .upsert(record, {
        onConflict: 'section,topic'
      });
    
    if (error) {
      console.error(`  ❌ Error uploading ${file.relativePath}:`, error.message);
      return false;
    }
    
    console.log(`  ✅ Successfully uploaded`);
    return true;
  } catch (err) {
    console.error(`  ❌ Error processing ${file.relativePath}:`, err.message);
    return false;
  }
}

/**
 * Main migration function
 */
async function migrateHandbooks() {
  console.log('🚀 Starting handbook migration to Supabase...\n');
  
  let totalFiles = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const section of HANDBOOK_SECTIONS) {
    console.log(`📚 Processing section: ${section.name} (${section.id})`);
    
    const sectionDir = path.join(__dirname, '..', 'public', section.directory);
    console.log(`📁 Scanning directory: ${sectionDir}`);
    
    const files = scanDirectory(sectionDir);
    console.log(`📋 Found ${files.length} files\n`);
    
    totalFiles += files.length;
    
    if (files.length === 0) {
      console.log(`⚠️ No files found in ${section.directory}\n`);
      continue;
    }
    
    for (const file of files) {
      const success = await uploadFile(section, file);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }
    
    console.log(`\n✅ Section ${section.name} completed\n`);
  }
  
  console.log('📊 Migration Summary:');
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Successfully uploaded: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log('\n🎉 Migration completed successfully!');
  } else {
    console.log('\n⚠️ Migration completed with some errors. Please review the output above.');
  }
}

/**
 * Verify Supabase connection and table existence
 */
async function verifySetup() {
  try {
    console.log('🔍 Verifying Supabase connection...');
    
    const { data, error } = await supabase
      .from('handbook_files')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Failed to connect to Supabase or table does not exist:', error.message);
      console.log('\n💡 Make sure you have:');
      console.log('   1. Created the handbook_files table using the migration SQL');
      console.log('   2. Set the correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
      console.log('   3. Configured RLS policies for public read access');
      return false;
    }
    
    console.log('✅ Supabase connection verified');
    console.log(`📊 Current records in handbook_files: ${data?.length || 0}`);
    return true;
  } catch (err) {
    console.error('❌ Setup verification failed:', err.message);
    return false;
  }
}

/**
 * CLI interface
 */
async function main() {
  console.log('📚 Handbook to Supabase Migration Tool\n');
  
  // Verify setup first
  const setupOk = await verifySetup();
  if (!setupOk) {
    process.exit(1);
  }
  
  console.log('');
  
  // Check if user wants to proceed
  const args = process.argv.slice(2);
  if (!args.includes('--confirm')) {
    console.log('⚠️ This will upload handbook files to Supabase.');
    console.log('   Add --confirm flag to proceed with the migration.');
    console.log('\n   Example: node migrate-handbook-to-supabase.js --confirm');
    process.exit(0);
  }
  
  // Start migration
  await migrateHandbooks();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
}

export { migrateHandbooks, verifySetup };
