/**
 * Output Formatter
 * Formats synthesis into research map markdown
 */

/**
 * Format synthesis as research map markdown
 */
export function formatOutput(synthesis) {
  const lines = [];

  // Header
  lines.push(`# 🔬 Research Map: ${synthesis.query}`);
  lines.push('');

  // Summary (3 sentences)
  lines.push('## Summary');
  lines.push('');
  lines.push(synthesis.summary);
  lines.push('');

  // Five levels
  lines.push('## FUNDAMENTALS');
  lines.push('*What is widely accepted*');
  lines.push('');
  lines.push(synthesis.sections.fundamentals);
  lines.push('');

  lines.push('## CURRENT STATE');
  lines.push('*Dominant approaches and prevailing methods*');
  lines.push('');
  lines.push(synthesis.sections.currentState);
  lines.push('');

  lines.push('## CUTTING EDGE');
  lines.push('*Where disagreement or experimentation exists*');
  lines.push('');
  lines.push(synthesis.sections.cuttingEdge);
  lines.push('');

  lines.push('## IMPLICATIONS');
  lines.push('*Why disagreements matter in practice*');
  lines.push('');
  lines.push(synthesis.sections.implications);
  lines.push('');

  lines.push('## META');
  lines.push('*What remains unknown and why*');
  lines.push('');
  lines.push(synthesis.sections.meta);
  lines.push('');

  // Evidence snapshot
  lines.push('## Evidence Snapshot');
  lines.push('');
  lines.push('*Top evidence objects supporting this synthesis*');
  lines.push('');

  for (let i = 0; i < Math.min(6, synthesis.evidence.length); i++) {
    const ev = synthesis.evidence[i];
    // Extract short ID (e.g., "openalex-W123-0" -> "W123-0")
    const parts = ev.id.split('-');
    const id = parts.slice(1).join('-');
    
    lines.push(`**[${id}]** ${ev.paperTitle} (${ev.year})`);
    lines.push(`  - *${ev.authors.slice(0, 3).join(', ')}${ev.authors.length > 3 ? ' et al.' : ''}*`);
    lines.push(`  - Citations: ${ev.citations} | Strength: ${ev.evidenceStrength.toFixed(2)}`);
    lines.push(`  - Claim: "${ev.claim}"`);
    lines.push(`  - Direction: ${ev.findingDirection} | Method: ${ev.method}`);
    lines.push(`  - [View paper](${ev.url})`);
    lines.push('');
  }

  // Metadata
  if (synthesis.metadata) {
    lines.push('---');
    lines.push('');
    lines.push('### Research Metadata');
    lines.push('');
    lines.push(`- **Papers analyzed**: ${synthesis.metadata.totalPapers}`);
    lines.push(`- **Evidence objects**: ${synthesis.metadata.totalClaims}`);
    lines.push(`- **Claim groups**: ${synthesis.metadata.claimGroups}`);
    lines.push(`- **Consensus areas**: ${synthesis.metadata.consensus}`);
    lines.push(`- **Disputed areas**: ${synthesis.metadata.disputes}`);
    lines.push(`- **Knowledge gaps**: ${synthesis.metadata.gaps}`);
    lines.push(`- **Risk signals**: ${synthesis.metadata.risks}`);
    lines.push(`- **Year range**: ${synthesis.metadata.yearRange.min}-${synthesis.metadata.yearRange.max}`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format as JSON for programmatic use
 */
export function formatJSON(synthesis, pretty = true) {
  return JSON.stringify(synthesis, null, pretty ? 2 : 0);
}

/**
 * Format evidence snapshot as compact reference list
 */
export function formatEvidenceList(evidence, maxItems = 10) {
  const lines = [];
  
  for (let i = 0; i < Math.min(maxItems, evidence.length); i++) {
    const ev = evidence[i];
    const parts = ev.id.split('-');
    const id = parts.slice(1).join('-');
    lines.push(`[${id}] ${ev.authors[0]} et al. (${ev.year}). ${ev.paperTitle}. ${ev.venue}. ${ev.citations} citations.`);
  }
  
  return lines.join('\n');
}

/**
 * Format for Telegram (shorter)
 */
export function formatTelegram(synthesis) {
  const lines = [];

  lines.push(`🔬 *${synthesis.query}*\n`);
  lines.push(`${synthesis.summary}\n`);
  lines.push(`📊 ${synthesis.metadata.totalPapers} papers | ${synthesis.metadata.consensus} consensus areas | ${synthesis.metadata.disputes} disputes`);

  return lines.join('\n');
}
