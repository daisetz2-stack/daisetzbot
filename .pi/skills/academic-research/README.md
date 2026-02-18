# 5Levels Research System v2.0

**Grounded Academic Intelligence** - Dense knowledge synthesis backed by traceable evidence.

## Quick Start

```bash
cd /job/.pi/skills/5levels

# Run research pipeline
./research-pipeline.mjs "neural network pruning"

# With options
./research-pipeline.mjs "quantum error correction" \
  --papers=15 \
  --tokens=300 \
  --evidence=6 \
  --format=markdown
```

## What's Different from v1.0

| v1.0 (Old) | v2.0 (New) |
|-----------|-----------|
| Meta-commentary about research process | Dense knowledge synthesis |
| Generic findings without evidence | Every claim has evidence ID |
| Verbose pipeline descriptions | ≤300 token discipline |
| Process-focused | Substance-focused |
| "How we studied" | "What we learned" |

## Architecture

```
Query → OpenAlex/CORE → Evidence Extraction → Claim Grouping → Tension Detection → 5-Level Synthesis
```

### Evidence Objects

Each abstract is broken into atomic knowledge units:

```javascript
{
  claim: "Neural pruning reduces parameters by 90% with <1% accuracy loss",
  findingDirection: "positive",
  method: "experimental",
  domainContext: "computer vision, deep learning",
  uncertaintyFlag: false,
  evidenceStrength: 0.85
}
```

### Strategic Paper Selection

- **High-citation anchors** (40%) - Established findings
- **Recent frontier** (40%) - Last 2 years
- **Surveys** (20%) - Review papers

## Output: Research Map

```markdown
# 🔬 Research Map: [Query]

## Summary
[3 sentences max]

## FUNDAMENTALS → CURRENT STATE → CUTTING EDGE → IMPLICATIONS → META

## Evidence Snapshot
[Top 6 papers with claims, citations, strength]
```

**Token budget**: 300 tokens max for prose. Evidence snapshot preserved.

## Quality Guardrails

✅ **Traceability** - Every statement → evidence ID  
✅ **Substance** - Teach subject matter, not methodology  
✅ **Token discipline** - Hard 300 token limit  
✅ **Evidence grounding** - All claims → source papers  
✅ **No meta-commentary** - Focus on findings, not process  

## API Keys

- **OpenAlex** - Free, no key required (polite pool)
- **CORE** - Optional, set `CORE_API_KEY` for better rate limits

## Examples

### Narrow Technical Query
```bash
./research-pipeline.mjs "transformer attention mechanisms" --papers=12
```
Best for: Specific technical topics with clear research boundaries

### Broad Conceptual Query
```bash
./research-pipeline.mjs "climate change" --papers=20 --evidence=8
```
Best for: Interdisciplinary topics requiring diverse perspectives

### Emerging Topics
```bash
./research-pipeline.mjs "large language model alignment" --papers=15
```
Best for: Recent developments with active research

## Integration with Website

After generating research map:

1. **Extract levels** from synthesis sections
2. **Adapt language** for each audience (child → expert)
3. **Add cultural context** for Japanese version
4. **Publish** via `node /job/website/scripts/add-topic.js`

See `SKILL.md` for detailed integration workflow.

## Troubleshooting

**Issue**: No papers found  
**Fix**: Try broader query or add synonyms

**Issue**: Token limit exceeded  
**Fix**: System auto-truncates prose, preserves evidence

**Issue**: Too many irrelevant papers  
**Fix**: Use more specific technical terms

**Issue**: CORE API rate limited  
**Fix**: Set `CORE_API_KEY` environment variable

## Development

```bash
# Test pipeline
node test-pipeline.mjs

# Run specific module
node sources/openalex.mjs
node analysis/evidence-extractor.mjs
```

## Files

```
├── research-pipeline.mjs      # Main orchestrator
├── sources/
│   ├── openalex.mjs          # Primary: OpenAlex API
│   └── core.mjs              # Fallback: CORE API
├── analysis/
│   ├── evidence-extractor.mjs
│   ├── claim-grouper.mjs
│   └── tension-detector.mjs
├── synthesis/
│   └── five-level.mjs
└── utils/
    └── formatter.mjs
```

## Philosophy

> **"Maximize information density at each synthesis level."**

The goal is to produce research summaries that users can **actually read and learn from**, not wade through meta-analysis of research processes.

Every sentence should teach something concrete about the subject matter.
