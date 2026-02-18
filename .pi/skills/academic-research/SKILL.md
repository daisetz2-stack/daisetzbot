---
name: academic-research
description: Deep literature analysis with evidence extraction, claim grouping, tension detection, and research map generation. Use for academic research requiring grounded intelligence with traceable evidence from scholarly papers.
---

# Academic Research Skill v2.0

Generate comprehensive research maps with **grounded academic intelligence** - dense knowledge synthesis backed by traceable evidence from scholarly literature.

## Core Philosophy

**Prioritize substance over process.** Every synthesis statement must reference evidence. Focus on teaching actual subject matter, not describing research methodology.

## Research Pipeline

The system uses a lightweight academic intelligence pipeline:

1. **Multi-source abstract retrieval** (OpenAlex primary, CORE fallback)
2. **Evidence extraction** - atomic knowledge units from abstracts
3. **Claim grouping** - deterministic clustering at 60% similarity
4. **Tension detection** - disputes vs consensus identification
5. **Five-level synthesis** - structured knowledge output

### Evidence Objects

Each claim is extracted as an atomic knowledge unit:

```javascript
{
  claim: "specific finding from paper",
  findingDirection: "positive|negative|neutral|mixed",
  method: "experimental|observational|computational|...",
  domainContext: "extracted from paper metadata",
  uncertaintyFlag: boolean,
  evidenceStrength: 0.0-1.0
}
```

### Strategic Paper Selection

The system selects **8-12 papers strategically**:
- **3-4 high-citation anchors** (established findings)
- **3-4 recent frontier** (last 2 years)
- **1-2 surveys** (review papers)
- **Remainder for gaps** (under-studied areas)

## Output Format: Research Map

Maximum **300 tokens** for synthesis prose. Evidence snapshot preserved regardless of token limit.

```markdown
# 🔬 Research Map: [Query]

## Summary
[3 sentences: what we know, what's debated, what's unknown]

## FUNDAMENTALS
*What is widely accepted*
[Dense knowledge with evidence IDs]

## CURRENT STATE
*Dominant approaches and prevailing methods*
[Actual research findings with evidence IDs]

## CUTTING EDGE
*Where disagreement or experimentation exists*
[Specific disputes/experiments with evidence IDs]

## IMPLICATIONS
*Why disagreements matter in practice*
[Practical consequences]

## META
*What remains unknown and why*
[Concrete unknowns and research priorities]

## Evidence Snapshot
[Top 6 papers with specific claims, citations, strength scores]

### Research Metadata
[Papers analyzed, consensus areas, disputes, gaps, risks]
```

## Quality Guardrails

1. **Traceability**: Every synthesis statement → ≥1 evidence ID
2. **Substance over process**: Teach subject matter, not methodology
3. **Token discipline**: ≤300 tokens for prose, truncate if needed
4. **Evidence grounding**: All claims traceable to source papers
5. **No meta-commentary**: Eliminate "we studied" → focus on "we learned"

## Usage

### Command Line

```bash
cd /job/.pi/skills/academic-research
./research-pipeline.mjs "quantum computing" --papers=10 --tokens=300 --evidence=6
```

### Options

- `--papers N` - Target number of papers (default: 10)
- `--tokens N` - Max output tokens (default: 300)
- `--evidence N` - Max evidence objects in snapshot (default: 6)
- `--similarity N` - Claim grouping threshold 0-1 (default: 0.6)
- `--no-core` - Disable CORE fallback
- `--format FORMAT` - Output format: markdown|json|both

### Programmatic

```javascript
import { runResearch } from './research-pipeline.mjs';

const results = await runResearch('machine learning', {
  targetPapers: 10,
  maxOutputTokens: 300,
  maxEvidence: 6
});

console.log(results.synthesis);
```

## Relationship to 5levels-explainer Skill

This academic-research skill generates **research maps** (evidence-based synthesis), which can optionally be adapted into progressive educational content.

The **5levels-explainer** skill handles the `/5levels` command and creates bilingual progressive explanations.

### Optional: Adapting Research Maps to Educational Levels

After generating a research map, you can adapt it into 5 educational levels:

### Level 1 (Child 5-10)
- Use FUNDAMENTALS section
- Simplify to everyday language
- Concrete examples from daily life

### Level 2 (Teen 13-17)
- Expand FUNDAMENTALS + light CURRENT STATE
- Add relatable scenarios
- Basic mechanisms explained

### Level 3 (Undergraduate)
- FUNDAMENTALS + CURRENT STATE fully
- Technical terminology introduced
- Academic frameworks

### Level 4 (Graduate)
- All sections through IMPLICATIONS
- Advanced concepts and theory
- Critical analysis

### Level 5 (Expert)
- Complete research map including CUTTING EDGE + META
- Unsolved problems
- Future directions

## Cultural Adaptation for Japanese

Don't just translate - adapt:

- **Examples**: Western → Japanese cultural context
- **Metaphors**: Culture-appropriate analogies
- **Applications**: Region-specific challenges
- **Sources**: Include Japanese academic sources (J-STAGE, CiNii)

## Example Workflow

```bash
# 1. Generate research map
cd /job/.pi/skills/academic-research
./research-pipeline.mjs "quantum computing" > /job/tmp/quantum-research.md

# 2. Review output
cat /job/tmp/quantum-research.md

# 3. Adapt to 5 levels (manual or LLM-assisted)
# Create JSON structure per level

# 4. Publish to website
node /job/website/scripts/add-topic.js /job/tmp/quantum-topic.json
```

## Environment Variables

- `CORE_API_KEY` - (Optional) CORE API key for better rate limits
- `ANTHROPIC_API_KEY` - For LLM-assisted level generation

## Files Structure

```
.pi/skills/academic-research/
├── research-pipeline.mjs      # Main orchestrator
├── sources/
│   ├── openalex.mjs           # Primary source
│   └── core.mjs               # Fallback source
├── analysis/
│   ├── evidence-extractor.mjs # Extract atomic claims
│   ├── claim-grouper.mjs      # Group similar claims
│   └── tension-detector.mjs   # Detect disputes/consensus
├── synthesis/
│   └── five-level.mjs         # Generate research map
└── utils/
    └── formatter.mjs          # Output formatting
```

## Tips

- **High-quality abstracts**: System depends on abstract quality, not full text
- **Citation weight**: High-citation papers anchor FUNDAMENTALS
- **Recency**: Last 2 years define CUTTING EDGE
- **Disputes**: Flag disagreements explicitly in CUTTING EDGE
- **Gaps**: Make META actionable - specify what's unknown and why it matters
- **Token discipline**: If over 300 tokens, truncate prose but keep evidence
- **Evidence tracing**: Use `[id]` inline references throughout synthesis

## What Changed from v1.0

**Old system**: Meta-commentary about research process, generic findings, verbose pipeline descriptions

**New system**: 
- Dense knowledge synthesis with evidence IDs
- Atomic claim extraction from abstracts
- Deterministic grouping with similarity detection
- Tension/consensus detection
- Strict 300-token discipline
- Evidence snapshot always included
- Focus on substantive findings

The goal: **Users can read and learn**, not wade through meta-analysis.
