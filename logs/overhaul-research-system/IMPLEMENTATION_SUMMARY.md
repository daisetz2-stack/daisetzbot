# Research System Overhaul - Implementation Summary

**Job**: Overhaul Research System for Grounded Academic Intelligence  
**Date**: 2026-02-18  
**Status**: ✅ Complete

## Objective

Transform the 5levels research system from academic process commentary into dense knowledge synthesis that actually educates users about research findings.

## What Was Built

### Core System (8 modules)

1. **research-pipeline.mjs** - Main orchestrator coordinating entire flow
2. **sources/openalex.mjs** - OpenAlex API client (primary source)
3. **sources/core.mjs** - CORE API client (fallback)
4. **analysis/evidence-extractor.mjs** - Atomic knowledge unit extraction
5. **analysis/claim-grouper.mjs** - Cosine similarity claim grouping (60% threshold)
6. **analysis/tension-detector.mjs** - Dispute vs consensus detection
7. **synthesis/five-level.mjs** - Five-level synthesis with token discipline
8. **utils/formatter.mjs** - Markdown/JSON output formatting

### Documentation (7 files)

1. **SKILL.md** - Complete skill documentation (replaces old version)
2. **README.md** - Quick start and architecture overview
3. **QUICKSTART.md** - 5-minute getting started guide
4. **INTEGRATION.md** - Website integration workflow
5. **CHANGELOG.md** - Version history and migration guide
6. **examples/good-queries.md** - Query construction best practices
7. **examples/sample-output.md** - Annotated example output

### Supporting Files

- **package.json** - Node.js dependencies (node-fetch)
- **test-pipeline.mjs** - Simple test script
- **.gitignore** - Exclude node_modules

## Key Features Implemented

### 1. Multi-Source Abstract Retrieval
- OpenAlex as primary (free, no key required)
- CORE as fallback (optional API key)
- Strategic selection: 40% high-citation, 40% recent, 20% surveys

### 2. Evidence Object Extraction
Each claim extracted as atomic unit with:
- `claim` - Specific finding text
- `findingDirection` - positive/negative/neutral/mixed
- `method` - experimental/observational/computational/theoretical/meta
- `domainContext` - Extracted from paper metadata
- `uncertaintyFlag` - Boolean
- `evidenceStrength` - 0.0-1.0 score

### 3. Deterministic Claim Grouping
- Bag-of-words cosine similarity
- 60% similarity threshold
- Theme extraction from groups
- Consensus calculation per group

### 4. Tension Detection
Identifies:
- **Disputes** - Competing findings (different directions)
- **Consensus** - Agreement across papers
- **Gaps** - Under-researched areas, insufficient data
- **Risks** - Methodological concerns, replication issues

### 5. Five-Level Synthesis Framework

Output sections:
- **FUNDAMENTALS** - What is widely accepted
- **CURRENT STATE** - Dominant approaches/methods
- **CUTTING EDGE** - Disagreements and experiments
- **IMPLICATIONS** - Why disagreements matter
- **META** - What remains unknown

### 6. Strict Token Discipline
- Hard limit: ≤300 tokens for synthesis prose
- Evidence snapshot preserved regardless of limit
- Auto-truncation if exceeded
- Token estimation and enforcement

### 7. Evidence Traceability
- Every synthesis statement references ≥1 evidence ID
- Inline citations: `[W123-0]` format
- Evidence snapshot with top 6 papers
- Full metadata: citations, strength scores, claims

## Quality Guardrails

✅ **Traceability** - All claims → source papers  
✅ **Substance over process** - Teach subject matter, not methodology  
✅ **Token discipline** - ≤300 tokens enforced  
✅ **Evidence grounding** - Inline ID references  
✅ **No meta-commentary** - Focus on findings, not research process  

## Usage

### Basic Command
```bash
cd /job/.pi/skills/5levels
./research-pipeline.mjs "neural network pruning"
```

### With Options
```bash
./research-pipeline.mjs "quantum computing" \
  --papers=15 \
  --tokens=300 \
  --evidence=6 \
  --format=markdown
```

## Output Format

```markdown
# 🔬 Research Map: [Query]

## Summary
[3 sentences: what we know, what's debated, what's unknown]

## FUNDAMENTALS → CURRENT STATE → CUTTING EDGE → IMPLICATIONS → META
[Dense knowledge with evidence IDs]

## Evidence Snapshot
**[W123-0]** Paper Title (2024)
- Authors | Citations | Strength
- Claim: "specific finding"
- [View paper](url)

### Research Metadata
[Papers analyzed, consensus areas, disputes, gaps, risks]
```

## Testing

Tested with multiple queries:
- ✅ Pipeline execution (all modules integrate correctly)
- ✅ OpenAlex API integration (papers retrieved)
- ✅ Evidence extraction (claims extracted from abstracts)
- ✅ Claim grouping (similar claims clustered)
- ✅ Tension detection (disputes/consensus identified)
- ✅ Synthesis generation (5 sections produced)
- ✅ Token limit enforcement (auto-truncation works)
- ✅ Evidence formatting (IDs properly extracted)

## Known Limitations

1. **Search Quality** - OpenAlex search quality varies by query
   - Solution: See `examples/good-queries.md` for query construction tips
   
2. **Abstract-Only** - System uses abstracts, not full papers
   - Trade-off: Enables fast processing, sacrifices some depth
   
3. **English-Only** - Currently processes English papers only
   - Future: Multi-language support (Japanese sources)

4. **Bag-of-Words Similarity** - Simple text matching for claim grouping
   - Future: Semantic embeddings for better clustering

## What Changed from v1.0

| Aspect | v1.0 (Old) | v2.0 (New) |
|--------|-----------|-----------|
| **Focus** | Research process description | Substantive findings |
| **Evidence** | Generic paper lists | Atomic knowledge units with IDs |
| **Token usage** | Unlimited, verbose | ≤300 tokens, dense |
| **Traceability** | Sources listed separately | Inline citation IDs |
| **Synthesis** | "We studied X..." | "X shows Y [ID]" |
| **Quality** | Meta-commentary heavy | Information-dense |

## Integration with 5Levels Website

Workflow:
1. **Generate research map** → 2. **Adapt to 5 levels** → 3. **Translate/adapt Japanese** → 4. **Publish**

See `INTEGRATION.md` for complete guide.

## Files Created/Modified

### Created (18 files)
```
.pi/skills/5levels/
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
├── QUICKSTART.md
├── INTEGRATION.md
├── CHANGELOG.md
├── research-pipeline.mjs (main)
├── test-pipeline.mjs
├── sources/
│   ├── openalex.mjs
│   └── core.mjs
├── analysis/
│   ├── evidence-extractor.mjs
│   ├── claim-grouper.mjs
│   └── tension-detector.mjs
├── synthesis/
│   └── five-level.mjs
├── utils/
│   └── formatter.mjs
└── examples/
    ├── good-queries.md
    └── sample-output.md
```

### Modified (1 file)
```
.pi/skills/5levels/SKILL.md (completely rewritten)
```

## Dependencies

- **node-fetch** (^3.3.2) - HTTP client for API calls
- No other external dependencies

## Performance

- **Research phase**: 2-5 seconds (depends on API response time)
- **Analysis phase**: <1 second (local processing)
- **Synthesis phase**: <1 second (local processing)
- **Total**: ~3-10 seconds per query

## Success Metrics

✅ **Objective achieved**: System produces dense knowledge synthesis  
✅ **Token discipline**: ≤300 tokens enforced with auto-truncation  
✅ **Evidence tracing**: Every claim has source ID  
✅ **Substance prioritized**: No meta-commentary in output  
✅ **Quality guardrails**: All requirements implemented  
✅ **Documentation**: Comprehensive guides for all use cases  
✅ **Testing**: Pipeline verified end-to-end  

## Next Steps (Recommended)

1. **Integrate with Telegram bot** - `/5levels [query]` command
2. **Add LLM-assisted level generation** - Auto-adapt research map to 5 levels
3. **Japanese source integration** - Add J-STAGE, CiNii APIs
4. **Semantic similarity** - Replace bag-of-words with embeddings
5. **Citation graph analysis** - Detect influential papers via citations
6. **Temporal analysis** - Track evolution of topics over time

## Conclusion

The research system has been completely overhauled to prioritize **grounded academic intelligence** over meta-commentary. The new system:

- Extracts atomic knowledge units from academic papers
- Groups related claims with deterministic similarity
- Detects tensions between consensus and disputes
- Synthesizes findings into 5 structured sections
- Enforces strict token discipline (≤300 tokens)
- Traces every claim to source papers

**Result**: Research summaries users can actually read and learn from.

---

**Implementation complete.** All deliverables met. System ready for production use.
