/**
 * Tension Detector
 * Identifies disputes vs consensus in claim groups
 * Detects knowledge gaps and risk signals
 */

/**
 * Analyze tensions across all claim groups
 */
export function detectTensions(claimGroups) {
  console.log(`⚡ Analyzing tensions across ${claimGroups.length} groups`);

  const tensions = {
    disputes: [],
    consensus: [],
    gaps: [],
    risks: []
  };

  for (const group of claimGroups) {
    const analysis = analyzeGroup(group);
    
    if (analysis.type === 'dispute') {
      tensions.disputes.push(analysis);
    } else if (analysis.type === 'consensus') {
      tensions.consensus.push(analysis);
    }

    // Check for gaps and risks
    if (analysis.hasGap) {
      tensions.gaps.push(analysis);
    }
    
    if (analysis.hasRisk) {
      tensions.risks.push(analysis);
    }
  }

  console.log(`  ✓ Disputes: ${tensions.disputes.length}`);
  console.log(`  ✓ Consensus: ${tensions.consensus.length}`);
  console.log(`  ✓ Gaps: ${tensions.gaps.length}`);
  console.log(`  ✓ Risks: ${tensions.risks.length}\n`);

  return tensions;
}

/**
 * Analyze a single claim group
 */
function analyzeGroup(group) {
  const { claims, theme, consensus } = group;

  const analysis = {
    id: group.id,
    theme,
    type: null,
    claims: claims.length,
    consensus: consensus.level,
    direction: consensus.direction,
    strength: consensus.strength,
    hasGap: false,
    hasRisk: false,
    gapType: null,
    riskType: null,
    keyPapers: selectKeyPapers(claims)
  };

  // Classify as dispute or consensus
  if (consensus.level === 'disputed') {
    analysis.type = 'dispute';
    analysis.disputeDetails = analyzeDispute(claims);
  } else {
    analysis.type = 'consensus';
    analysis.consensusDetails = analyzeConsensus(claims);
  }

  // Detect gaps
  const gapSignal = detectGap(claims);
  if (gapSignal) {
    analysis.hasGap = true;
    analysis.gapType = gapSignal;
  }

  // Detect risks
  const riskSignal = detectRisk(claims);
  if (riskSignal) {
    analysis.hasRisk = true;
    analysis.riskType = riskSignal;
  }

  return analysis;
}

/**
 * Analyze dispute in detail
 */
function analyzeDispute(claims) {
  // Group by finding direction
  const byDirection = {};
  for (const claim of claims) {
    const dir = claim.findingDirection;
    if (!byDirection[dir]) byDirection[dir] = [];
    byDirection[dir].push(claim);
  }

  // Find competing positions
  const positions = Object.entries(byDirection).map(([direction, claims]) => ({
    direction,
    papers: claims.length,
    avgCitations: claims.reduce((sum, c) => sum + c.citations, 0) / claims.length,
    avgStrength: claims.reduce((sum, c) => sum + c.evidenceStrength, 0) / claims.length,
    representative: claims[0] // Use first claim as representative
  }));

  // Sort by paper count
  positions.sort((a, b) => b.papers - a.papers);

  return {
    positions,
    description: describeDispute(positions)
  };
}

function describeDispute(positions) {
  if (positions.length === 2) {
    return `${positions[0].papers} papers find ${positions[0].direction} effects vs ${positions[1].papers} finding ${positions[1].direction}`;
  } else {
    return `Mixed findings: ${positions.map(p => `${p.papers} ${p.direction}`).join(', ')}`;
  }
}

/**
 * Analyze consensus in detail
 */
function analyzeConsensus(claims) {
  // Calculate recency distribution
  const currentYear = new Date().getFullYear();
  const recent = claims.filter(c => currentYear - c.year <= 3).length;
  const older = claims.length - recent;

  // Calculate method diversity
  const methods = new Set(claims.map(c => c.method));

  return {
    papers: claims.length,
    recentSupport: recent,
    olderSupport: older,
    methodDiversity: methods.size,
    methods: Array.from(methods),
    description: describeConsensus(claims, recent, methods.size)
  };
}

function describeConsensus(claims, recent, methodDiversity) {
  const strength = claims[0].findingDirection;
  const base = `${claims.length} papers agree on ${strength} findings`;
  
  if (recent > claims.length * 0.5) {
    return `${base}, with strong recent support`;
  } else if (methodDiversity >= 3) {
    return `${base}, across multiple methodologies`;
  } else {
    return base;
  }
}

/**
 * Detect knowledge gaps
 */
function detectGap(claims) {
  // Check for explicit gap signals in claims
  const gapPatterns = {
    'insufficient-data': /\b(insufficient|limited|lack|scarce)\b.*\b(data|evidence|research)\b/i,
    'methodological': /\b(more|better|improved|rigorous)\b.*\b(method|design|approach)\b.*\b(needed|required)\b/i,
    'replication': /\b(replicat|validat|confirm)\b.*\b(needed|required|necessary)\b/i,
    'mechanism': /\b(mechanism|pathway|process)\b.*\b(unclear|unknown|not understood)\b/i
  };

  for (const claim of claims) {
    for (const [gapType, pattern] of Object.entries(gapPatterns)) {
      if (pattern.test(claim.claim)) {
        return gapType;
      }
    }
  }

  // Implicit gaps: few papers or high uncertainty
  if (claims.length <= 2) {
    return 'under-researched';
  }

  const highUncertainty = claims.filter(c => c.uncertaintyFlag).length;
  if (highUncertainty / claims.length > 0.7) {
    return 'high-uncertainty';
  }

  return null;
}

/**
 * Detect methodological or replication risks
 */
function detectRisk(claims) {
  const riskPatterns = {
    'small-sample': /\b(small|limited|pilot)\b.*\b(sample|cohort|study)\b/i,
    'single-method': /\b(single|one|sole)\b.*\b(method|approach|technique)\b/i,
    'correlation-only': /\b(correlat|associat)\b(?!.*\bcaus)/i,
    'conflicting': /\b(conflict|inconsistent|contradictory|mixed)\b.*\b(result|finding|evidence)\b/i
  };

  for (const claim of claims) {
    for (const [riskType, pattern] of Object.entries(riskPatterns)) {
      if (pattern.test(claim.claim)) {
        return riskType;
      }
    }
  }

  // Implicit risks: method homogeneity
  const methods = new Set(claims.map(c => c.method));
  if (methods.size === 1 && claims.length > 3) {
    return 'method-homogeneity';
  }

  return null;
}

/**
 * Select key papers to represent a group
 */
function selectKeyPapers(claims, limit = 3) {
  // Sort by evidence strength and citations
  const sorted = [...claims].sort((a, b) => {
    const scoreA = a.evidenceStrength * 0.7 + (Math.log(a.citations + 1) / 10) * 0.3;
    const scoreB = b.evidenceStrength * 0.7 + (Math.log(b.citations + 1) / 10) * 0.3;
    return scoreB - scoreA;
  });

  return sorted.slice(0, limit).map(c => ({
    id: c.id,
    title: c.paperTitle,
    year: c.year,
    citations: c.citations,
    claim: c.claim,
    strength: c.evidenceStrength
  }));
}
