#!/usr/bin/env node
/**
 * Quick test of the research pipeline
 * Usage: node test-pipeline.mjs
 */

import { runResearch } from './research-pipeline.mjs';
import { formatOutput } from './utils/formatter.mjs';

async function test() {
  console.log('Testing research pipeline with sample query...\n');

  try {
    const results = await runResearch('machine learning', {
      targetPapers: 5, // Small test
      maxOutputTokens: 300,
      maxEvidence: 4
    });

    console.log('\n' + '='.repeat(70));
    console.log('TEST RESULTS');
    console.log('='.repeat(70));
    console.log('\nFormatted Output:\n');
    console.log(formatOutput(results.synthesis));

    console.log('\n' + '='.repeat(70));
    console.log('✅ TEST PASSED');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

test();
