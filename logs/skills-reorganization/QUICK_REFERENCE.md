# Skills Quick Reference: 5levels-explainer vs academic-research

## When to Use Which?

### Use `5levels-explainer` when you want:
- ✅ Progressive educational content (Child → Expert)
- ✅ Bilingual explanations (English + Japanese)
- ✅ Comprehensive web research across all complexity levels
- ✅ Long-form report (8,000-15,000 words)
- ✅ Culturally adapted content
- ✅ Published to website
- ✅ Triggered by `/5levels [keyword]` command

**Example use case:** Explaining quantum computing to different audiences

### Use `academic-research` when you want:
- ✅ Evidence extraction from scholarly papers
- ✅ Claim grouping and similarity detection
- ✅ Tension/consensus detection in research
- ✅ Research maps with traceable evidence
- ✅ Dense knowledge synthesis (300 tokens)
- ✅ Source paper analysis (OpenAlex, CORE APIs)
- ✅ Programmatic research pipeline

**Example use case:** Analyzing current state of machine learning research with specific evidence chains

## Command Comparison

### 5levels-explainer

**Telegram:**
```
/5levels quantum computing
```

**Job Description:**
```
Read the file at .pi/skills/5levels-explainer/SKILL.md and follow its instructions 
to create a bilingual 5-level explanation for: quantum computing
```

**Duration:** 60-90 minutes  
**Output:** `logs/[JOB_ID]/5levels_report.md` (8,000-15,000 words)

---

### academic-research

**Command Line:**
```bash
cd .pi/skills/academic-research
./research-pipeline.mjs "quantum computing" --papers=10 --tokens=300 --evidence=6
```

**Job Description:**
```
Read the file at .pi/skills/academic-research/SKILL.md and use it to generate 
a research map for: quantum computing
```

**Duration:** Varies by paper count  
**Output:** Research map with evidence snapshot (~300 token synthesis)

## Output Format Comparison

### 5levels-explainer Output Structure

```markdown
# 5 Levels Research Report: [Topic]

## Executive Summary
...

## Level 1: Foundation & Overview (ELI5)
Simple definitions accessible to anyone

## Level 2: Core Concepts & Components
Breaking down into essential parts

## Level 3: Deep Dive & Technical Details
Detailed mechanisms and processes

## Level 4: Applications, Implications & Impact
Real-world applications and use cases

## Level 5: Advanced Perspectives & Future Directions
Latest developments and frontier research

## Sources
[30-50 citations]
```

---

### academic-research Output Structure

```markdown
# 🔬 Research Map: [Query]

## Summary
[3 sentences: what we know, what's debated, what's unknown]

## FUNDAMENTALS
*What is widely accepted* [with evidence IDs]

## CURRENT STATE
*Dominant approaches* [with evidence IDs]

## CUTTING EDGE
*Where disagreement exists* [with evidence IDs]

## IMPLICATIONS
*Why disagreements matter in practice*

## META
*What remains unknown and why*

## Evidence Snapshot
[Top 6 papers with specific claims, citations, strength scores]

### Research Metadata
[Papers analyzed, consensus areas, disputes, gaps]
```

## File Locations

```
.pi/skills/
├── 5levels-explainer/
│   ├── SKILL.md                    # Skill definition
│   ├── 5levels_research.md         # Research methodology
│   ├── 5levels_report_template.md  # Report structure
│   ├── 5levels_report.md           # Example report
│   └── README.md                   # Full documentation
│
└── academic-research/
    ├── SKILL.md                    # Skill definition
    ├── research-pipeline.mjs       # Main orchestrator
    ├── sources/                    # OpenAlex, CORE APIs
    ├── analysis/                   # Evidence extraction
    ├── synthesis/                  # Research map generator
    └── README.md                   # Full documentation
```

## Integration Points

### Both Skills Can Work Together

1. **Start with academic-research** - Get evidence-based research map
2. **Feed into 5levels-explainer** - Adapt findings into progressive educational content

**Example workflow:**
```bash
# Step 1: Generate research map
cd .pi/skills/academic-research
./research-pipeline.mjs "quantum computing" > /tmp/research-map.md

# Step 2: Create educational content job
# Job description: "Read /tmp/research-map.md and .pi/skills/5levels-explainer/SKILL.md. 
# Use the research findings to create a bilingual 5-level explanation."
```

### Unique Use Cases

**5levels-explainer only:**
- Creating content for general audiences
- Bilingual educational materials
- Website publishing
- When depth across all complexity levels is needed

**academic-research only:**
- Literature review synthesis
- Finding research gaps and tensions
- Evidence-based analysis
- When concise, traceable evidence is priority

**Both together:**
- Research → Education pipeline
- Evidence-grounded teaching materials
- Academic content for lay audiences

## Common Pitfalls

❌ **Don't use 5levels-explainer when:**
- You need just evidence extraction (use academic-research)
- You want concise output (use academic-research)
- You're analyzing scholarly papers specifically (use academic-research)

❌ **Don't use academic-research when:**
- You need bilingual content (use 5levels-explainer)
- You want long-form educational content (use 5levels-explainer)
- You need progressive complexity levels (use 5levels-explainer)
- You want website publishing (use 5levels-explainer)

## Dependencies

### 5levels-explainer requires:
- `brave-search` skill (for web research)
- `BRAVE_API_KEY` in `LLM_SECRETS`

### academic-research requires:
- No external API keys (OpenAlex is free, CORE optional)
- `CORE_API_KEY` in `LLM_SECRETS` (optional, for better rate limits)

## Testing Commands

### Test 5levels-explainer
```bash
# Via Telegram
/5levels neural networks

# Via job creation (in chat)
"Create a 5levels explanation for neural networks"
```

### Test academic-research
```bash
# Command line
cd .pi/skills/academic-research
./research-pipeline.mjs "neural networks" --papers=8 --tokens=300

# Programmatic (in Node.js)
import { runResearch } from '.pi/skills/academic-research/research-pipeline.mjs';
const results = await runResearch('neural networks');
console.log(results.synthesis);
```

## Quick Decision Tree

```
Need research on a topic?
│
├─ For teaching/explaining? ──────────► 5levels-explainer
│   └─ Bilingual? ────────────────────► 5levels-explainer
│   └─ Progressive levels? ───────────► 5levels-explainer
│
└─ For literature analysis? ──────────► academic-research
    └─ Evidence extraction? ──────────► academic-research
    └─ Finding research gaps? ────────► academic-research
    └─ Tension detection? ────────────► academic-research
```

## Support

For issues or questions:
- **5levels-explainer**: See `.pi/skills/5levels-explainer/README.md`
- **academic-research**: See `.pi/skills/academic-research/README.md`

---

**Last Updated:** 2026-02-18  
**Version:** Post-reorganization
