#!/usr/bin/env node
/**
 * Research Pipeline - Orchestrator
 * Coordinates the entire research → synthesis flow
 * Usage: ./research-pipeline.mjs "quantum computing"
 */

import { getCoreSet } from './sources/openalex.mjs';
import { supplementWithCORE } from './sources/core.mjs';
import { extractAllEvidence } from './analysis/evidence-extractor.mjs';
import { groupClaims } from './analysis/claim-grouper.mjs';
import { detectTensions } from './analysis/tension-detector.mjs';
import { synthesize } from './synthesis/five-level.mjs';
import { formatOutput } from './utils/formatter.mjs';

/**
 * Main research pipeline
 */
export async function runResearch(query, options = {}) {
  const {
    targetPapers = 10,
    claimSimilarity = 0.6,
    maxOutputTokens = 300,
    maxEvidence = 6,
    useCore = true
  } = options;

  console.log('🔬 RESEARCH PIPELINE START\n');
  console.log(`Query: "${query}"`);
  console.log(`Target: ${targetPapers} papers\n`);
  console.log('='.repeat(60) + '\n');

  try {
    // STEP 1: Multi-source abstract retrieval
    console.log('STEP 1: Multi-source Abstract Retrieval');
    console.log('-'.repeat(60));
    
    let papers = await getCoreSet(query, {
      highCitationCount: Math.ceil(targetPapers * 0.4),
      recentCount: Math.ceil(targetPapers * 0.4),
      surveyCount: Math.ceil(targetPapers * 0.2)
    });

    // Fallback to CORE if needed
    if (useCore && papers.all.length < targetPapers) {
      papers.all = await supplementWithCORE(query, papers.all, targetPapers);
    }

    if (papers.all.length === 0) {
      throw new Error('No papers found with abstracts');
    }

    // STEP 2: Evidence extraction
    console.log('STEP 2: Evidence Object Extraction');
    console.log('-'.repeat(60));
    
    const evidence = extractAllEvidence(papers.all);

    if (evidence.length === 0) {
      throw new Error('No evidence objects extracted');
    }

    // STEP 3: Claim grouping
    console.log('STEP 3: Claim Grouping');
    console.log('-'.repeat(60));
    
    const claimGroups = groupClaims(evidence, claimSimilarity);

    // STEP 4: Tension detection
    console.log('STEP 4: Tension Detection');
    console.log('-'.repeat(60));
    
    const tensions = detectTensions(claimGroups);

    // STEP 5: Five-level synthesis
    console.log('STEP 5: Five-Level Synthesis');
    console.log('-'.repeat(60));
    
    const synthesis = synthesize(query, claimGroups, tensions, {
      maxTokens: maxOutputTokens,
      maxEvidence
    });

    console.log('='.repeat(60));
    console.log('✅ PIPELINE COMPLETE\n');

    return {
      query,
      papers: papers.all,
      evidence,
      claimGroups,
      tensions,
      synthesis
    };

  } catch (error) {
    console.error('\n❌ PIPELINE FAILED:', error.message);
    throw error;
  }
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: ./research-pipeline.mjs "your search query" [options]');
    console.error('\nOptions:');
    console.error('  --papers N        Target number of papers (default: 10)');
    console.error('  --tokens N        Max output tokens (default: 300)');
    console.error('  --evidence N      Max evidence objects in output (default: 6)');
    console.error('  --similarity N    Claim similarity threshold 0-1 (default: 0.6)');
    console.error('  --no-core         Disable CORE fallback');
    console.error('  --json            Output raw JSON');
    console.error('  --format FORMAT   Output format: markdown|json|both (default: markdown)');
    process.exit(1);
  }

  // Parse arguments
  const query = args[0];
  const options = {
    targetPapers: parseInt(args.find(a => a.startsWith('--papers'))?.split('=')[1]) || 10,
    maxOutputTokens: parseInt(args.find(a => a.startsWith('--tokens'))?.split('=')[1]) || 300,
    maxEvidence: parseInt(args.find(a => a.startsWith('--evidence'))?.split('=')[1]) || 6,
    claimSimilarity: parseFloat(args.find(a => a.startsWith('--similarity'))?.split('=')[1]) || 0.6,
    useCore: !args.includes('--no-core')
  };

  const format = args.find(a => a.startsWith('--format'))?.split('=')[1] || 'markdown';
  const jsonOnly = args.includes('--json');

  try {
    const results = await runResearch(query, options);

    // Output results
    if (jsonOnly || format === 'json') {
      console.log(JSON.stringify(results.synthesis, null, 2));
    }

    if (!jsonOnly && (format === 'markdown' || format === 'both')) {
      console.log('\n' + '='.repeat(60));
      console.log('RESEARCH MAP OUTPUT');
      console.log('='.repeat(60) + '\n');
      console.log(formatOutput(results.synthesis));
    }

  } catch (error) {
    console.error('\nError:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
