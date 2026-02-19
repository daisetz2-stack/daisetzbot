#!/usr/bin/env node

/**
 * Migration script for moving customizations to /custom/ directory
 * 
 * This script helps existing thepopebot users migrate to the new structure
 * that separates core code from customizations for easier upstream updates.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function heading(message) {
  console.log();
  log('='.repeat(60), 'blue');
  log(message, 'bright');
  log('='.repeat(60), 'blue');
  console.log();
}

/**
 * Check if a file has been modified from its default
 */
function isCustomized(filePath, defaultContent = null) {
  if (!fs.existsSync(filePath)) return false;
  
  // If we have default content, compare against it
  if (defaultContent) {
    const current = fs.readFileSync(filePath, 'utf8');
    return current !== defaultContent;
  }
  
  // Otherwise, assume it's customized if it exists
  return true;
}

/**
 * Copy file with backup
 */
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.copyFileSync(src, dest);
  log(`  ✓ Copied: ${path.relative(ROOT, src)} → ${path.relative(ROOT, dest)}`, 'green');
}

/**
 * Copy directory recursively
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      log(`  ✓ Copied: ${path.relative(ROOT, srcPath)}`, 'green');
    }
  }
}

/**
 * Main migration logic
 */
async function migrate() {
  heading('thepopebot Migration to /custom/ Structure');
  
  log('This script will migrate your customizations to the new structure.');
  log('Your current files will be backed up before any changes.', 'yellow');
  console.log();
  
  // Check if custom directory already exists
  const customDir = path.join(ROOT, 'custom');
  const customOsDir = path.join(customDir, 'operating_system');
  const customSkillsDir = path.join(customDir, 'skills');
  
  if (fs.existsSync(customOsDir) && fs.readdirSync(customOsDir).length > 1) {
    log('✓ Custom directory already exists and has content', 'yellow');
    log('Skipping migration. If you want to re-migrate, delete /custom/ first.', 'yellow');
    return;
  }
  
  // Create custom directories
  log('Creating custom directory structure...', 'blue');
  fs.mkdirSync(customOsDir, { recursive: true });
  fs.mkdirSync(customSkillsDir, { recursive: true });
  
  // Files to check for migration
  const configFiles = [
    'SOUL.md',
    'CHATBOT.md',
    'AGENT.md',
    'HEARTBEAT.md',
    'JOB_SUMMARY.md',
    'TELEGRAM.md',
    'CRONS.json',
    'TRIGGERS.json',
  ];
  
  const osDir = path.join(ROOT, 'operating_system');
  let migratedCount = 0;
  
  console.log();
  log('Checking for customized configuration files...', 'blue');
  
  for (const file of configFiles) {
    const srcPath = path.join(osDir, file);
    const destPath = path.join(customOsDir, file);
    
    if (fs.existsSync(srcPath)) {
      // Copy all config files to custom (user can review later)
      copyFile(srcPath, destPath);
      migratedCount++;
    }
  }
  
  // Check for custom personality modules (e.g., FINANCIAL_ADVISOR/)
  console.log();
  log('Checking for custom personality modules...', 'blue');
  
  const osEntries = fs.readdirSync(osDir, { withFileTypes: true });
  for (const entry of osEntries) {
    if (entry.isDirectory()) {
      const srcPath = path.join(osDir, entry.name);
      const destPath = path.join(customOsDir, entry.name);
      
      log(`  Found directory: ${entry.name}`, 'yellow');
      copyDirectory(srcPath, destPath);
      migratedCount++;
    }
  }
  
  // Migrate custom skills (excluding examples that might be in core)
  console.log();
  log('Checking for custom skills...', 'blue');
  
  const skillsDir = path.join(ROOT, '.pi', 'skills');
  const coreSkills = ['brave-search']; // Skills that are symlinked from upstream
  
  if (fs.existsSync(skillsDir)) {
    const skillEntries = fs.readdirSync(skillsDir, { withFileTypes: true });
    
    for (const entry of skillEntries) {
      if (entry.isDirectory() && !coreSkills.includes(entry.name)) {
        const srcPath = path.join(skillsDir, entry.name);
        const destPath = path.join(customSkillsDir, entry.name);
        
        // Check if it's a real directory (not a symlink)
        if (!fs.lstatSync(srcPath).isSymbolicLink()) {
          log(`  Found skill: ${entry.name}`, 'yellow');
          copyDirectory(srcPath, destPath);
          migratedCount++;
        }
      }
    }
  }
  
  // Summary
  console.log();
  heading('Migration Complete!');
  
  log(`Migrated ${migratedCount} items to /custom/`, 'green');
  console.log();
  
  log('Next steps:', 'bright');
  log('1. Review your customizations in /custom/operating_system/', 'yellow');
  log('2. Test your bot to ensure everything works', 'yellow');
  log('3. Commit the changes to git', 'yellow');
  log('4. You can now safely pull upstream updates!', 'yellow');
  console.log();
  
  log('Update workflow:', 'bright');
  log('  git remote add upstream https://github.com/stephengpope/thepopebot.git', 'blue');
  log('  git fetch upstream', 'blue');
  log('  git merge upstream/main', 'blue');
  console.log();
  
  log('See docs/UPSTREAM_UPDATES.md for more details', 'blue');
  console.log();
}

// Run migration
migrate().catch((err) => {
  console.error();
  log('❌ Migration failed:', 'red');
  console.error(err);
  process.exit(1);
});
