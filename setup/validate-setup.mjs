#!/usr/bin/env node

/**
 * Validation script for thepopebot setup
 * 
 * Checks that all critical files and configurations are in place
 * and that the custom/default fallback system is working correctly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ANSI colors
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

const checks = [];
let passedCount = 0;
let failedCount = 0;
let warningCount = 0;

function check(name, test, type = 'error') {
  const result = test();
  checks.push({ name, passed: result, type });
  
  if (result) {
    log(`  ✓ ${name}`, 'green');
    passedCount++;
  } else {
    if (type === 'warning') {
      log(`  ⚠ ${name}`, 'yellow');
      warningCount++;
    } else {
      log(`  ✗ ${name}`, 'red');
      failedCount++;
    }
  }
  
  return result;
}

/**
 * Resolve config file (custom → default)
 */
function resolveConfig(filename) {
  const customPath = path.join(ROOT, 'custom', 'operating_system', filename);
  const defaultPath = path.join(ROOT, 'operating_system', filename);
  
  if (fs.existsSync(customPath)) {
    return { path: customPath, source: 'custom' };
  } else if (fs.existsSync(defaultPath)) {
    return { path: defaultPath, source: 'default' };
  }
  return { path: null, source: null };
}

/**
 * Main validation
 */
function validate() {
  heading('thepopebot Setup Validation');
  
  // Core files
  log('Checking core files...', 'blue');
  check('Dockerfile exists', () => fs.existsSync(path.join(ROOT, 'Dockerfile')));
  check('entrypoint.sh exists', () => fs.existsSync(path.join(ROOT, 'entrypoint.sh')));
  check('Event handler exists', () => fs.existsSync(path.join(ROOT, 'event_handler', 'server.js')));
  check('.gitattributes exists', () => fs.existsSync(path.join(ROOT, '.gitattributes')));
  
  console.log();
  
  // Directory structure
  log('Checking directory structure...', 'blue');
  check('custom/ directory exists', () => fs.existsSync(path.join(ROOT, 'custom')));
  check('custom/operating_system/ exists', () => fs.existsSync(path.join(ROOT, 'custom', 'operating_system')));
  check('custom/skills/ exists', () => fs.existsSync(path.join(ROOT, 'custom', 'skills')));
  check('operating_system/ exists', () => fs.existsSync(path.join(ROOT, 'operating_system')));
  check('.pi/skills/ exists', () => fs.existsSync(path.join(ROOT, '.pi', 'skills')));
  
  console.log();
  
  // Configuration files (show source)
  log('Checking configuration files...', 'blue');
  
  const configFiles = [
    'SOUL.md',
    'CHATBOT.md',
    'AGENT.md',
    'CRONS.json',
    'TRIGGERS.json',
  ];
  
  for (const file of configFiles) {
    const { path: filePath, source } = resolveConfig(file);
    if (source) {
      log(`  ✓ ${file} (${source})`, source === 'custom' ? 'green' : 'blue');
      passedCount++;
    } else {
      log(`  ✗ ${file} (missing)`, 'red');
      failedCount++;
    }
  }
  
  console.log();
  
  // Skills
  log('Checking skills...', 'blue');
  const skillsDir = path.join(ROOT, '.pi', 'skills');
  const customSkillsDir = path.join(ROOT, 'custom', 'skills');
  
  let totalSkills = 0;
  
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir);
    log(`  Found ${skills.length} skills in .pi/skills/`, 'blue');
    totalSkills += skills.length;
  }
  
  if (fs.existsSync(customSkillsDir)) {
    const customSkills = fs.readdirSync(customSkillsDir).filter(name => {
      const skillPath = path.join(customSkillsDir, name);
      return fs.statSync(skillPath).isDirectory();
    });
    if (customSkills.length > 0) {
      log(`  Found ${customSkills.length} custom skills:`, 'green');
      customSkills.forEach(skill => log(`    - ${skill}`, 'green'));
    }
    totalSkills += customSkills.length;
  }
  
  check(`At least one skill available`, () => totalSkills > 0);
  
  console.log();
  
  // GitHub Actions
  log('Checking GitHub Actions...', 'blue');
  const workflowsDir = path.join(ROOT, '.github', 'workflows');
  check('run-job.yml exists', () => fs.existsSync(path.join(workflowsDir, 'run-job.yml')));
  check('auto-merge.yml exists', () => fs.existsSync(path.join(workflowsDir, 'auto-merge.yml')));
  check('update-event-handler.yml exists', () => fs.existsSync(path.join(workflowsDir, 'update-event-handler.yml')));
  
  console.log();
  
  // Summary
  heading('Validation Summary');
  
  log(`✓ Passed: ${passedCount}`, 'green');
  if (warningCount > 0) {
    log(`⚠ Warnings: ${warningCount}`, 'yellow');
  }
  if (failedCount > 0) {
    log(`✗ Failed: ${failedCount}`, 'red');
  }
  
  console.log();
  
  if (failedCount === 0) {
    log('🎉 All critical checks passed!', 'green');
    console.log();
    log('Your thepopebot is properly configured.', 'green');
    console.log();
    
    if (warningCount > 0) {
      log('Note: Some optional checks have warnings. Review them above.', 'yellow');
      console.log();
    }
    
    return true;
  } else {
    log('❌ Some critical checks failed!', 'red');
    console.log();
    log('Please address the failed checks above before running your bot.', 'yellow');
    console.log();
    return false;
  }
}

// Run validation
const success = validate();
process.exit(success ? 0 : 1);
