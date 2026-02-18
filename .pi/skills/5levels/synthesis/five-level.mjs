/**
 * Five-Level Synthesis
 * Generates grounded academic intelligence with strict token discipline
 * Output format: FUNDAMENTALS → CURRENT STATE → CUTTING EDGE → IMPLICATIONS → META
 */

/**
 * Synthesize research into 5-level format
 * @param {string} query - Original search query
 * @param {Array} claimGroups - Grouped evidence claims
 * @param {Object} tensions - Detected tensions (disputes, consensus, gaps, risks)
 * @param {Object} options - Synthesis options
 * @returns {Object} Five-level synthesis output
 */
export function synthesize(query, claimGroups, tensions, options = {}) {
  const {
    maxTokens = 300,
    maxEvidence = 6,
    includeMetadata = true
  } = options;

  console.log(`📝 Synthesizing 5-level output for: "${query}"`);
  console.log(`  Token limit: ${maxTokens}`);
  console.log(`  Evidence limit: ${maxEvidence}\n`);

  // Select strategic evidence objects
  const selectedEvidence = selectStrategicEvidence(claimGroups, tensions, maxEvidence);

  // Build synthesis sections
  const synthesis = {
    query,
    sections: {
      fundamentals: buildFundamentals(tensions.consensus, selectedEvidence),
      currentState: buildCurrentState(tensions.consensus, selectedEvidence),
      cuttingEdge: buildCuttingEdge(tensions.disputes, tensions.gaps, selectedEvidence),
      implications: buildImplications(tensions, selectedEvidence),
      meta: buildMeta(tensions.gaps, tensions.risks)
    },
    summary: null, // Generated after sections
    evidence: selectedEvidence,
    metadata: includeMetadata ? buildMetadata(claimGroups, tensions) : null
  };

  // Generate 3-sentence synthesis
  synthesis.summary = generateSummary(synthesis.sections);

  // Enforce token limit
  const tokenCount = estimateTokens(synthesis);
  if (tokenCount > maxTokens) {
    console.warn(`⚠️  Output exceeds token limit (${tokenCount} > ${maxTokens})`);
    console.warn(`   Truncating prose, preserving evidence snapshot\n`);
    synthesis.sections = truncateSections(synthesis.sections, maxTokens - 100);
  }

  console.log(`✓ Synthesis complete (≈${estimateTokens(synthesis)} tokens)\n`);

  return synthesis;
}

/**
 * Select strategic evidence objects (8-12 total)
 * 3-4 high-citation anchors, 3-4 recent frontier, 1-2 surveys, remainder for gaps
 */
function selectStrategicEvidence(claimGroups, tensions, limit = 6) {
  const selected = [];

  // Flatten all claims
  const allClaims = claimGroups.flatMap(g => g.claims);

  // 1. High-citation anchors (sorted by citations)
  const highCitation = [...allClaims]
    .sort((a, b) => b.citations - a.citations)
    .slice(0, 3);
  selected.push(...highCitation);

  // 2. Recent frontier (last 2 years, sorted by year then strength)
  const currentYear = new Date().getFullYear();
  const recent = [...allClaims]
    .filter(c => currentYear - c.year <= 2)
    .sort((a, b) => b.year - a.year || b.evidenceStrength - a.evidenceStrength)
    .slice(0, 3);
  
  // Add recent papers not already selected
  for (const claim of recent) {
    if (!selected.find(c => c.id === claim.id)) {
      selected.push(claim);
    }
  }

  // 3. Fill remaining slots with gap-related or high-strength evidence
  const remaining = limit - selected.length;
  if (remaining > 0) {
    const gapClaims = tensions.gaps.flatMap(g => g.keyPapers.map(p => 
      allClaims.find(c => c.id === p.id)
    )).filter(Boolean);

    const filler = [...gapClaims, ...allClaims]
      .filter(c => !selected.find(s => s.id === c.id))
      .sort((a, b) => b.evidenceStrength - a.evidenceStrength)
      .slice(0, remaining);

    selected.push(...filler);
  }

  // Deduplicate by paper ID
  const unique = [];
  const seen = new Set();
  for (const claim of selected) {
    if (!seen.has(claim.paperId)) {
      unique.push(claim);
      seen.add(claim.paperId);
    }
  }

  return unique.slice(0, limit);
}

/**
 * Build FUNDAMENTALS section (widely accepted knowledge)
 */
function buildFundamentals(consensusGroups, evidence) {
  if (consensusGroups.length === 0) {
    return 'Limited established consensus in current literature.';
  }

  // Focus on strong consensus with high citation support
  const strong = consensusGroups
    .filter(g => g.consensus === 'strong-consensus' || g.consensus === 'consensus')
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 2);

  if (strong.length === 0) {
    return 'Emerging field with developing consensus.';
  }

  const points = strong.map(g => {
    const refs = g.keyPapers.map(p => {
      // Extract short ID from full evidence ID (e.g., "openalex-W123-0" -> "W123-0")
      const parts = p.id.split('-');
      return `[${parts.slice(1).join('-')}]`;
    }).join('');
    return `${g.theme}: ${g.consensusDetails.description} ${refs}`;
  });

  return points.join('. ') + '.';
}

/**
 * Build CURRENT STATE section (dominant approaches)
 */
function buildCurrentState(consensusGroups, evidence) {
  if (consensusGroups.length === 0) {
    return 'Active research area with multiple competing approaches.';
  }

  // Focus on what's actively being studied
  const methods = new Set();
  const approaches = [];

  for (const group of consensusGroups.slice(0, 3)) {
    if (group.consensusDetails) {
      group.consensusDetails.methods.forEach(m => methods.add(m));
      approaches.push(group.theme);
    }
  }

  const methodStr = Array.from(methods).join(', ');
  const approachStr = approaches.slice(0, 3).join(', ');

  return `Prevailing methods: ${methodStr}. Active research on ${approachStr}.`;
}

/**
 * Build CUTTING EDGE section (disputes and experiments)
 */
function buildCuttingEdge(disputes, gaps, evidence) {
  const points = [];

  // Disputes first
  if (disputes.length > 0) {
    const topDispute = disputes[0];
    points.push(`Disagreement on ${topDispute.theme}: ${topDispute.disputeDetails.description}`);
  }

  // Recent experiments
  const recentEvidence = evidence
    .filter(e => new Date().getFullYear() - e.year <= 2)
    .slice(0, 2);

  if (recentEvidence.length > 0) {
    const experiments = recentEvidence.map(e => {
      const parts = e.id.split('-');
      const ref = `[${parts.slice(1).join('-')}]`;
      return `${e.paperTitle.substring(0, 40)}... (${e.year}) ${ref}`;
    });
    points.push(`Recent work: ${experiments.join('; ')}`);
  }

  return points.length > 0 ? points.join('. ') + '.' : 'Consolidated field with few active disputes.';
}

/**
 * Build IMPLICATIONS section (practical consequences)
 */
function buildImplications(tensions, evidence) {
  const implications = [];

  // If there are disputes, what does that mean?
  if (tensions.disputes.length > 0) {
    implications.push(`${tensions.disputes.length} unresolved debates affect practical application`);
  }

  // If there are risks, flag them
  if (tensions.risks.length > 0) {
    const riskTypes = tensions.risks.map(r => r.riskType);
    const unique = [...new Set(riskTypes)];
    implications.push(`Methodological concerns: ${unique.join(', ')}`);
  }

  // Strong consensus = actionable
  if (tensions.consensus.length >= 3 && tensions.disputes.length === 0) {
    implications.push('Strong evidence base supports confident application');
  }

  return implications.length > 0 
    ? implications.join('. ') + '.'
    : 'Implications depend on resolution of current uncertainties.';
}

/**
 * Build META section (unknowns and gaps)
 */
function buildMeta(gaps, risks) {
  if (gaps.length === 0) {
    return 'Well-studied domain with few identified gaps.';
  }

  const gapTypes = gaps.map(g => g.gapType);
  const unique = [...new Set(gapTypes)];

  const descriptions = {
    'insufficient-data': 'Limited empirical data',
    'methodological': 'Need for improved methods',
    'replication': 'Replication studies needed',
    'mechanism': 'Unclear mechanisms',
    'under-researched': 'Understudied area',
    'high-uncertainty': 'High uncertainty across studies'
  };

  const gapList = unique.map(type => descriptions[type] || type).join('; ');
  return `Key unknowns: ${gapList}. Research priorities: ${gaps[0].theme}.`;
}

/**
 * Generate 3-sentence summary
 */
function generateSummary(sections) {
  // Sentence 1: What we know (FUNDAMENTALS)
  const know = sections.fundamentals.split('.')[0];

  // Sentence 2: What's being debated (CUTTING EDGE)
  const debate = sections.cuttingEdge.split('.')[0];

  // Sentence 3: What's unknown (META)
  const unknown = sections.meta.split('.')[0];

  return `${know}. ${debate}. ${unknown}.`;
}

/**
 * Build metadata section
 */
function buildMetadata(claimGroups, tensions) {
  const allClaims = claimGroups.flatMap(g => g.claims);
  
  return {
    totalPapers: new Set(allClaims.map(c => c.paperId)).size,
    totalClaims: allClaims.length,
    claimGroups: claimGroups.length,
    disputes: tensions.disputes.length,
    consensus: tensions.consensus.length,
    gaps: tensions.gaps.length,
    risks: tensions.risks.length,
    yearRange: {
      min: Math.min(...allClaims.map(c => c.year)),
      max: Math.max(...allClaims.map(c => c.year))
    }
  };
}

/**
 * Estimate token count (rough approximation)
 */
function estimateTokens(synthesis) {
  const text = JSON.stringify(synthesis);
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Truncate sections to fit token limit (preserve evidence)
 */
function truncateSections(sections, targetTokens) {
  // Keep first sentence of each section
  const truncated = {};
  
  for (const [key, value] of Object.entries(sections)) {
    const sentences = value.split('.');
    truncated[key] = sentences[0] + '.';
  }

  return truncated;
}
