#!/usr/bin/env node

/**
 * Load personal context from LLM_SECRETS
 * 
 * Reads PERSONAL_CONTEXT from environment (LLM_SECRETS),
 * parses JSON, validates structure, and returns formatted output.
 * 
 * Usage: node load-context.js
 * Output: JSON with { available: boolean, context?: object, message?: string }
 */

const fs = require('fs');
const path = require('path');

// Storage directory for personal context
const CONTEXT_DIR = '/job/logs/personal-context';
const PROFILE_FILE = path.join(CONTEXT_DIR, 'profile.json');

function loadContext() {
  try {
    // Try to load from LLM_SECRETS environment variable
    const personalContextJson = process.env.PERSONAL_CONTEXT;
    
    if (!personalContextJson) {
      // No personal context in environment
      return {
        available: false,
        message: 'No personal context configured in LLM_SECRETS'
      };
    }

    // Parse the JSON
    let context;
    try {
      context = JSON.parse(personalContextJson);
    } catch (parseError) {
      return {
        available: false,
        message: `Failed to parse PERSONAL_CONTEXT: ${parseError.message}`,
        error: true
      };
    }

    // Ensure context directory exists
    if (!fs.existsSync(CONTEXT_DIR)) {
      fs.mkdirSync(CONTEXT_DIR, { recursive: true });
    }

    // Save to profile file for persistence across jobs
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(context, null, 2));

    // Return the context
    return {
      available: true,
      context: context
    };

  } catch (error) {
    return {
      available: false,
      message: `Error loading personal context: ${error.message}`,
      error: true
    };
  }
}

// Execute and output JSON
const result = loadContext();
console.log(JSON.stringify(result, null, 2));
