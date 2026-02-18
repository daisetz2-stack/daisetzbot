# Changelog

## v2.0.0 - 2026-02-18

### 🎯 Core Philosophy Shift

**From**: Academic process commentary  
**To**: Dense knowledge synthesis with evidence tracing

### ✨ New Features

#### 1. Evidence Object Extraction
- **Atomic knowledge units** extracted from abstracts
- Each claim tagged with:
  - `findingDirection` (positive/negative/neutral/mixed)
  - `method` (experimental/observational/computational/theoretical/meta)
  - `domainContext` (from paper metadata)
  - `uncertaintyFlag` (boolean)
  - `evidenceStrength` (0.0-1.0 score)

#### 2. Multi-Source Abstract Retrieval
- **Primary**: OpenAlex API (free, no key required)
- **Fallback**: CORE API (optional key for better rate limits)
- Strategic paper selection:
  - 3-4 high-citation anchors (established findings)
  - 3-4 recent frontier (last 2 years)
  - 1-2 surveys (review papers)
  - Remainder for knowledge gaps

#### 3. Deterministic Claim Grouping
- Cosine similarity on bag-of-words features
- **60% threshold** for grouping similar claims
- Theme extraction from grouped claims
- Consensus calculation per group

#### 4. Tension Detection
- **Disputes**: Competing findings on same topic
- **Consensus**: Agreement across multiple papers
- **Gaps**: Under-researched areas, insufficient data
- **Risks**: Methodological concerns, replication issues

#### 5. Five-Level Synthesis Framework
Replace verbose descriptions with focused synthesis:
- **FUNDAMENTALS**: What is widely accepted
- **CURRENT STATE**: Dominant approaches and methods
- **CUTTING EDGE**: Disagreements and experiments
- **IMPLICATIONS**: Why disagreements matter
- **META**: What remains unknown

#### 6. Strict Token Discipline
- **Hard limit**: ≤300 tokens for synthesis prose
- Evidence snapshot preserved regardless of limit
- Auto-truncation if exceeded
- Token estimation and enforcement

#### 7. Evidence Traceability
- Every synthesis statement references ≥1 evidence ID
- Inline citations: `[W123-0]` format
- Evidence snapshot with top 6 papers
- Full claim text, citations, strength scores

### 🔧 Technical Implementation

#### New Modules
```
sources/
  ├── openalex.mjs      # OpenAlex API client
  └── core.mjs          # CORE API fallback
analysis/
  ├── evidence-extractor.mjs
  ├── claim-grouper.mjs
  └── tension-detector.mjs
synthesis/
  └── five-level.mjs
utils/
  └── formatter.mjs
```

#### CLI Interface
```bash
./research-pipeline.mjs "query" \
  --papers=N \
  --tokens=N \
  --evidence=N \
  --similarity=N \
  --format=markdown|json|both
```

### 📊 Output Format Changes

#### Old Format (v1.0)
```markdown
## Level 5: Expert

Research on [topic] shows that [finding]. 
Studies have investigated [methodology].
Further research is needed...

Sources:
- Paper 1
- Paper 2
```

#### New Format (v2.0)
```markdown
# 🔬 Research Map: [Query]

## Summary
[3 sentences: know, debate, unknown]

## FUNDAMENTALS
[Dense knowledge] [W123-0][W456-1]

## CURRENT STATE
[Actual findings] [W789-2]

## CUTTING EDGE
[Specific disputes] [W234-3]

## IMPLICATIONS
[Practical consequences]

## META
[Concrete unknowns]

## Evidence Snapshot
**[W123-0]** Title (2024)
- Authors et al.
- Citations: 150 | Strength: 0.85
- Claim: "specific finding text"
- [View paper](url)
```

### 🎨 Quality Improvements

1. **Eliminated meta-commentary**: No more "we studied" → focus on "we learned"
2. **Maximized information density**: Every sentence teaches subject matter
3. **Removed generic statements**: Replaced with specific claims
4. **Added evidence grounding**: All claims traceable to papers
5. **Focused on substance**: Research findings over methodology

### 🚫 Removed Features

- Generic 5-level prose generation (moved to manual/LLM-assisted after research)
- Brave Search integration for general web content (kept for other purposes)
- Automatic translation (cultural adaptation now manual/LLM-assisted)

### 📚 Documentation

- **README.md**: Quick start and architecture
- **SKILL.md**: Complete usage guide
- **examples/good-queries.md**: Query construction tips
- **CHANGELOG.md**: This file

### 🔄 Migration Guide

If you have existing v1.0 jobs:

1. **Research phase**: Use new `research-pipeline.mjs` instead of Brave Search
2. **Synthesis phase**: Extract from research map sections instead of generating prose
3. **Evidence**: Reference evidence IDs inline instead of separate sources section
4. **Token budget**: Respect 300-token limit per synthesis

### 🐛 Bug Fixes

- Evidence ID extraction now properly formatted (e.g., `W123-0` not just `0`)
- Token estimation accuracy improved
- Duplicate paper detection in multi-source retrieval
- Abstract reconstruction from OpenAlex inverted index

### ⚡ Performance

- Parallel API requests for efficiency
- Strategic paper selection reduces unnecessary API calls
- Deterministic grouping algorithm (no randomness)
- Efficient cosine similarity calculation

### 🔮 Future Enhancements

- [ ] Multi-language abstract support (Japanese sources)
- [ ] Citation graph analysis for influence detection
- [ ] Semantic similarity using embeddings (vs bag-of-words)
- [ ] Temporal trend analysis (evolution over time)
- [ ] Author network analysis
- [ ] Automated level generation from research map
- [ ] Integration with LLM for cultural adaptation

---

## v1.0.0 - 2026-02-14

Initial release with Brave Search integration and manual 5-level generation.
