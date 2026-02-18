/**
 * Claim Grouper
 * Groups similar claims using cosine similarity on text features
 * Deterministic grouping with 60% similarity threshold
 */

/**
 * Group similar evidence claims
 */
export function groupClaims(evidence, threshold = 0.6) {
  if (evidence.length === 0) return [];

  console.log(`🔗 Grouping ${evidence.length} claims (threshold: ${threshold})`);
  
  const groups = [];
  const assigned = new Set();

  // Simple text-based similarity (bag of words + cosine)
  for (let i = 0; i < evidence.length; i++) {
    if (assigned.has(i)) continue;

    const group = {
      id: `group-${groups.length}`,
      claims: [evidence[i]],
      theme: null, // Extracted after grouping
      consensus: null // Calculated after grouping
    };

    assigned.add(i);

    // Find similar claims
    for (let j = i + 1; j < evidence.length; j++) {
      if (assigned.has(j)) continue;

      const similarity = calculateSimilarity(
        evidence[i].claim,
        evidence[j].claim
      );

      if (similarity >= threshold) {
        group.claims.push(evidence[j]);
        assigned.add(j);
      }
    }

    // Only keep groups with at least 1 claim (always true)
    groups.push(group);
  }

  // Extract theme and consensus for each group
  for (const group of groups) {
    group.theme = extractTheme(group.claims);
    group.consensus = calculateConsensus(group.claims);
  }

  // Sort by group size (largest first)
  groups.sort((a, b) => b.claims.length - a.claims.length);

  console.log(`  ✓ Created ${groups.length} claim groups`);
  console.log(`  Largest group: ${groups[0].claims.length} claims`);
  console.log(`  Smallest group: ${groups[groups.length - 1].claims.length} claims\n`);

  return groups;
}

/**
 * Calculate cosine similarity between two text strings
 */
function calculateSimilarity(text1, text2) {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  // Build vocabulary
  const vocab = new Set([...tokens1, ...tokens2]);
  
  // Create vectors
  const vec1 = Array.from(vocab).map(word => tokens1.filter(t => t === word).length);
  const vec2 = Array.from(vocab).map(word => tokens2.filter(t => t === word).length);

  // Cosine similarity
  return cosineSimilarity(vec1, vec2);
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3) // Filter short words
    .filter(word => !STOPWORDS.has(word));
}

function cosineSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (mag1 * mag2);
}

/**
 * Extract common theme from grouped claims
 */
function extractTheme(claims) {
  // Find most common meaningful words across all claims
  const allTokens = claims.flatMap(c => tokenize(c.claim));
  const wordCounts = {};

  for (const token of allTokens) {
    wordCounts[token] = (wordCounts[token] || 0) + 1;
  }

  // Get top 3 words
  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);

  return topWords.join(' ');
}

/**
 * Calculate consensus level within a group
 */
function calculateConsensus(claims) {
  if (claims.length === 1) {
    return {
      level: 'single',
      direction: claims[0].findingDirection,
      strength: claims[0].evidenceStrength
    };
  }

  // Check direction agreement
  const directions = claims.map(c => c.findingDirection);
  const directionCounts = {};
  for (const dir of directions) {
    directionCounts[dir] = (directionCounts[dir] || 0) + 1;
  }

  const majorityDirection = Object.entries(directionCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  const majorityCount = directionCounts[majorityDirection];
  const consensusRatio = majorityCount / claims.length;

  // Average evidence strength
  const avgStrength = claims.reduce((sum, c) => sum + c.evidenceStrength, 0) / claims.length;

  let level;
  if (consensusRatio >= 0.9) level = 'strong-consensus';
  else if (consensusRatio >= 0.7) level = 'consensus';
  else if (consensusRatio >= 0.5) level = 'weak-consensus';
  else level = 'disputed';

  return {
    level,
    direction: majorityDirection,
    strength: avgStrength,
    papers: claims.length,
    agreement: consensusRatio
  };
}

// Common English stopwords
const STOPWORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'are', 'was', 'were',
  'been', 'have', 'has', 'had', 'their', 'they', 'them', 'than', 'then',
  'these', 'those', 'when', 'where', 'which', 'while', 'who', 'will', 'would',
  'could', 'should', 'can', 'may', 'must', 'shall', 'our', 'your'
]);
