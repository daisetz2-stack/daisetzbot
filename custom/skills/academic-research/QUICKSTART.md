# Quick Start Guide

Get up and running with the research system in 5 minutes.

## Installation

```bash
cd /job/.pi/skills/5levels
npm install  # Already done if you see node_modules/
```

## Basic Usage

```bash
# Generate research map
./research-pipeline.mjs "neural network pruning"
```

That's it! You'll get a research map with:
- 5 synthesis sections (FUNDAMENTALS → META)
- Top 6 evidence papers with citations
- Metadata on consensus/disputes/gaps

## Example Output

```markdown
# 🔬 Research Map: neural network pruning

## Summary
Magnitude-based pruning achieves 70-90% sparsity with <2% accuracy loss...

## FUNDAMENTALS
8 papers agree on positive findings [W4391-0][W4722-1]...

## Evidence Snapshot
**[W4391-0]** Deep Compression... (2015)
- Citations: 8,547 | Strength: 0.90
- Claim: "We reduce storage by 90% through pruning..."
```

## Common Commands

```bash
# More papers
./research-pipeline.mjs "quantum computing" --papers=15

# JSON output
./research-pipeline.mjs "CRISPR" --format=json

# Adjust token limit
./research-pipeline.mjs "climate models" --tokens=250

# More evidence in snapshot
./research-pipeline.mjs "protein folding" --evidence=8

# Everything together
./research-pipeline.mjs "federated learning" \
  --papers=12 \
  --tokens=300 \
  --evidence=6 \
  --format=markdown
```

## Query Tips

✅ **Good queries** (specific, 3-5 words):
- `"neural network pruning"`
- `"quantum error correction"`
- `"CRISPR off-target effects"`

❌ **Bad queries** (too broad or generic):
- `"machine learning"`
- `"physics"`
- `"medical research"`

See `examples/good-queries.md` for more examples.

## Next Steps

1. **Generate research map** - Use the command above
2. **Review output** - Check evidence snapshot for quality
3. **Adapt to levels** - See `INTEGRATION.md` for full workflow
4. **Publish** - Use website scripts to add topic

## Troubleshooting

**No papers found?**
→ Try a broader query with more common terms

**Irrelevant papers?**
→ Use more specific technical terminology

**Output too long?**
→ System auto-truncates, evidence preserved

**Want better search results?**
→ Set `CORE_API_KEY` environment variable for fallback API

## Files to Know

| File | What It Does |
|------|--------------|
| `research-pipeline.mjs` | Main entry point |
| `SKILL.md` | Complete documentation |
| `INTEGRATION.md` | Website integration guide |
| `examples/good-queries.md` | Query construction tips |
| `examples/sample-output.md` | Example research map |

## Philosophy

> **Substance over process. Evidence over commentary.**

This system produces **grounded academic intelligence** - dense knowledge synthesis backed by traceable evidence. Every claim references papers. Every synthesis statement teaches subject matter, not research methodology.

Compare:

❌ Old: "Research on topic X has been conducted. Studies show various findings..."

✅ New: "Technique X achieves 90% reduction with <1% loss [W123-0][W456-1]. Disputed: mechanism unclear [W789-2]."

Information density maximized. Meta-commentary eliminated.

---

**Ready to generate your first research map?**

```bash
./research-pipeline.mjs "your topic here"
```
