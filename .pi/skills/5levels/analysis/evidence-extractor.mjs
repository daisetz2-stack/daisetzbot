/**
 * Evidence Object Extractor
 * Extracts atomic knowledge units from paper abstracts
 * Each evidence object represents a single testable claim
 */

/**
 * Extract evidence objects from a paper
 * Returns array of atomic knowledge units
 */
export function extractEvidence(paper) {
  if (!paper.abstract) {
    return [];
  }

  // Split abstract into sentences (simple approach)
  const sentences = paper.abstract
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20); // Filter out fragments

  const evidence = [];
  let evidenceId = 0;

  for (const sentence of sentences) {
    // Skip meta-sentences (too generic)
    if (isMetaSentence(sentence)) {
      continue;
    }

    // Determine if this is a finding vs background
    const isFindings = detectFindings(sentence);
    if (!isFindings) {
      continue; // Skip background/intro sentences
    }

    // Extract claim with metadata
    const claim = {
      id: `${paper.source}-${paper.id.split('/').pop()}-${evidenceId++}`,
      paperId: paper.id,
      paperTitle: paper.title,
      authors: paper.authors,
      year: paper.year,
      citations: paper.citations,
      venue: paper.venue,
      url: paper.url,
      
      // Core claim
      claim: sentence,
      
      // Metadata
      findingDirection: detectDirection(sentence),
      method: detectMethod(sentence),
      domainContext: extractContext(paper),
      uncertaintyFlag: detectUncertainty(sentence),
      evidenceStrength: calculateStrength(paper, sentence)
    };

    evidence.push(claim);
  }

  return evidence;
}

/**
 * Extract evidence from all papers
 */
export function extractAllEvidence(papers) {
  const allEvidence = [];
  
  for (const paper of papers) {
    const evidence = extractEvidence(paper);
    allEvidence.push(...evidence);
  }

  console.log(`🔬 Extracted ${allEvidence.length} evidence objects from ${papers.length} papers`);
  
  return allEvidence;
}

// ============================================================================
// Detection Heuristics
// ============================================================================

function isMetaSentence(sentence) {
  const metaPatterns = [
    /^(this|these|our|the) (paper|study|research|work|article)/i,
    /^(we|the authors) (present|propose|describe|introduce|review)/i,
    /^(in this|here we)/i,
    /recently|increasingly|growing interest/i
  ];
  
  return metaPatterns.some(pattern => pattern.test(sentence));
}

function detectFindings(sentence) {
  const findingPatterns = [
    /\b(found|showed|demonstrated|revealed|indicated|suggest|show|prove)\b/i,
    /\b(result|evidence|finding|observation|data)\b.*\b(indicate|suggest|show|demonstrate)\b/i,
    /\b(significant|correlation|association|relationship|effect)\b/i,
    /\b(increase|decrease|improve|reduce|enhance|inhibit)\b/i,
    /\b(more|less|higher|lower|better|worse)\b.*\bthan\b/i
  ];
  
  return findingPatterns.some(pattern => pattern.test(sentence));
}

function detectDirection(sentence) {
  // Positive, negative, neutral, or mixed findings
  const positive = /\b(increase|improve|enhance|benefit|positive|better|effective|successful)\b/i;
  const negative = /\b(decrease|reduce|inhibit|worsen|negative|worse|ineffective|failure)\b/i;
  
  const hasPositive = positive.test(sentence);
  const hasNegative = negative.test(sentence);
  
  if (hasPositive && hasNegative) return 'mixed';
  if (hasPositive) return 'positive';
  if (hasNegative) return 'negative';
  return 'neutral';
}

function detectMethod(sentence) {
  // Extract methodology signals
  const methodPatterns = {
    experimental: /\b(experiment|trial|study|test|measure)\b/i,
    observational: /\b(observ|survey|cohort|longitudinal)\b/i,
    computational: /\b(simulat|model|comput|algorithm)\b/i,
    theoretical: /\b(theor|mathematical|analytical)\b/i,
    meta: /\b(meta-analysis|review|systematic)\b/i
  };
  
  for (const [method, pattern] of Object.entries(methodPatterns)) {
    if (pattern.test(sentence)) {
      return method;
    }
  }
  
  return 'unspecified';
}

function extractContext(paper) {
  // Extract domain context from paper metadata
  const contexts = [];
  
  // From concepts (OpenAlex)
  if (paper.concepts && paper.concepts.length > 0) {
    contexts.push(...paper.concepts
      .filter(c => c.score > 0.5)
      .map(c => c.name)
      .slice(0, 3)
    );
  }
  
  // From venue
  if (paper.venue && paper.venue !== 'Unknown') {
    contexts.push(paper.venue);
  }
  
  return contexts.join(', ') || 'general';
}

function detectUncertainty(sentence) {
  const uncertaintyPatterns = [
    /\b(may|might|could|possibly|potentially|suggest|indicate|appear|seem)\b/i,
    /\b(unclear|uncertain|inconclusive|preliminary|exploratory)\b/i,
    /\b(further research|more study|additional work)\b.*\b(needed|required)\b/i
  ];
  
  return uncertaintyPatterns.some(pattern => pattern.test(sentence));
}

function calculateStrength(paper, sentence) {
  // Evidence strength score (0-1)
  let strength = 0.5; // Base
  
  // Citation boost (high-citation papers = stronger evidence)
  if (paper.citations > 100) strength += 0.2;
  else if (paper.citations > 50) strength += 0.1;
  
  // Recency penalty (very old papers get slight penalty)
  const age = new Date().getFullYear() - paper.year;
  if (age > 10) strength -= 0.1;
  
  // Uncertainty penalty
  if (detectUncertainty(sentence)) strength -= 0.2;
  
  // Strong language boost
  if (/\b(significant|strong|robust|consistent)\b/i.test(sentence)) {
    strength += 0.1;
  }
  
  return Math.max(0.1, Math.min(1.0, strength));
}
