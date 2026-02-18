# Integration Guide

How to use the research system with the 5Levels website.

## Complete Workflow

```
1. Research → 2. Adapt → 3. Translate → 4. Publish
```

### Step 1: Generate Research Map

```bash
cd /job/.pi/skills/5levels

# Run research pipeline
./research-pipeline.mjs "neural network pruning" \
  --papers=12 \
  --tokens=300 \
  --evidence=6 \
  > /job/tmp/pruning-research.md
```

**Output**: Research map with 5 sections (FUNDAMENTALS → META)

### Step 2: Adapt to 5 Levels

Map research sections to educational levels:

| Level | Audience | Source Sections | Adaptation |
|-------|----------|----------------|-----------|
| 1 | Child (5-10) | FUNDAMENTALS | Simplify to everyday language, concrete examples |
| 2 | Teen (13-17) | FUNDAMENTALS + light CURRENT STATE | Relatable scenarios, basic mechanisms |
| 3 | Undergrad | FUNDAMENTALS + CURRENT STATE | Technical terms, academic frameworks |
| 4 | Graduate | All through IMPLICATIONS | Advanced concepts, critical analysis |
| 5 | Expert | Complete map + CUTTING EDGE + META | Unsolved problems, future directions |

#### Example Adaptation

**Research Map FUNDAMENTALS**:
> Magnitude-based pruning: 8 papers agree on positive findings [W4391-0][W4722-1]. Weight magnitude correlates with importance; iterative pruning outperforms one-shot [W5543-3].

**Level 1 (Child)**:
> Imagine a neural network is like a big book full of information. Some pages are really important, but some pages don't help much. Neural network pruning is like finding which pages we don't really need and carefully removing them. This makes the book lighter and easier to carry around, but it still has all the important information we need!

**Level 3 (Undergraduate)**:
> Neural network pruning reduces model parameters by removing weights with low magnitudes. Research consistently shows that 70-90% of parameters can be removed with minimal accuracy loss (<2%) through iterative pruning cycles. The magnitude of weights correlates with their contribution to model predictions, making magnitude-based pruning an effective compression technique.

**Level 5 (Expert)**:
> Magnitude-based pruning achieves 70-90% sparsity with <2% accuracy degradation across vision tasks [Han et al. 2015, 8547 citations]. The lottery ticket hypothesis [Frankle & Carbin 2018, 3891 citations] suggests that dense networks contain sparse subnetworks trainable from initialization, though replication studies show mixed results. Open questions: optimal pruning schedules for LLMs, structured pruning for hardware efficiency, theoretical understanding of pruning-induced generalization.

### Step 3: Cultural Adaptation (Japanese)

Don't just translate - adapt examples and context:

**English Example**:
> Like organizing your closet - you remove clothes you never wear

**Japanese Adaptation**:
> 断捨離のように - 本当に必要なものだけを残す (danshari principle)

**English Application**:
> Deploying ML models on smartphones

**Japanese Application**:
> スマホアプリやIoTデバイスへの組み込み (embedded in smartphone apps and IoT devices)

### Step 4: Create JSON Structure

```json
{
  "id": "neural-network-pruning",
  "keyword": {
    "en": "Neural Network Pruning",
    "ja": "ニューラルネットワークの枝刈り"
  },
  "created": "2026-02-18T15:00:00Z",
  "colors": {
    "level1": "#E3B341",
    "level2": "#E07A3F",
    "level3": "#C06C84",
    "level4": "#4C78A8",
    "level5": "#2A8F87"
  },
  "levels": {
    "en": [
      {
        "level": 1,
        "title": "Child (Age 5-10)",
        "content": "Imagine a neural network is like..."
      },
      // ... levels 2-5
    ],
    "ja": [
      {
        "level": 1,
        "title": "子ども（5〜10歳）",
        "content": "ニューラルネットワークは..."
      },
      // ... levels 2-5
    ]
  },
  "sources": [
    {
      "title": "Deep Compression: Compressing Deep Neural Networks",
      "url": "https://doi.org/10.48550/arxiv.1510.00149",
      "language": "en"
    },
    // ... more sources from evidence snapshot
  ]
}
```

### Step 5: Publish

```bash
# Validate and publish
node /job/website/scripts/add-topic.js /job/tmp/pruning-topic.json

# Output:
# ✓ Topic is valid
# ✓ Wrote topic to: /job/website/public/data/topics/neural-network-pruning.json
# ✓ Rebuilt index with N topics
# ✓ Topic added successfully!
#   View at: /topic/neural-network-pruning
```

## Automation Options

### Option A: Manual (Current)
1. Generate research map
2. Manually adapt to 5 levels
3. Manually translate/adapt Japanese
4. Publish

**Best for**: High-quality, curated content

### Option B: LLM-Assisted
1. Generate research map
2. Use Claude/GPT-4 to draft 5 levels from research map
3. Review and refine
4. Publish

**Best for**: Faster iteration with quality control

### Option C: Fully Automated (Future)
1. Pipeline generates research map + 5 levels + translations
2. Auto-publish with review flag
3. Human review before making public

**Best for**: High-volume content generation

## LLM Prompt Templates

### For Level Generation

```
I have a research map on [TOPIC]. Please adapt the FUNDAMENTALS section 
into Level 1 (Child 5-10) content:

Requirements:
- Use simple everyday language
- Concrete examples from daily life
- No jargon or technical terms
- 2-3 short paragraphs
- Make it engaging and fun

Research Map FUNDAMENTALS:
[paste section]

Generate Level 1 content:
```

### For Japanese Adaptation

```
I have English Level 3 content on [TOPIC]. Please create culturally 
adapted Japanese version:

Requirements:
- Not direct translation - adapt examples for Japanese context
- Use Japanese cultural references where appropriate
- Maintain technical accuracy
- Natural Japanese writing style

English content:
[paste content]

Create Japanese adaptation:
```

## Quality Checklist

Before publishing, verify:

- [ ] All 5 levels present in both languages
- [ ] Content appropriate for each level (complexity progression)
- [ ] Japanese is adapted, not just translated
- [ ] Sources include papers from evidence snapshot
- [ ] Examples are culturally appropriate
- [ ] Technical accuracy maintained across levels
- [ ] No placeholder text or TODOs

## Tips for Success

### Research Phase
- Use specific queries (see `examples/good-queries.md`)
- Target 10-15 papers for comprehensive coverage
- Review evidence snapshot for key papers to cite

### Adaptation Phase
- Start with Level 3 (most straightforward)
- Expand up to Level 5 (add cutting edge)
- Simplify down to Level 1 (remove complexity)
- Level 2 bridges 1→3, Level 4 bridges 3→5

### Translation Phase
- Adapt examples, not just words
- Consider regional research (J-STAGE, CiNii for Japanese sources)
- Use appropriate honorifics and formality levels
- Test with native speaker if possible

### Publishing Phase
- Review in website UI before committing
- Check mobile display
- Verify all links work
- Test language switching

## Common Issues

**Issue**: Research map too technical for Level 1/2  
**Solution**: Focus on FUNDAMENTALS only, use analogies

**Issue**: Not enough content for Level 5  
**Solution**: Expand CUTTING EDGE and META sections with specific open questions

**Issue**: Japanese version feels like translation  
**Solution**: Rewrite with Japanese examples and cultural context from scratch

**Issue**: Sources list is too long  
**Solution**: Pick top 5-6 from evidence snapshot (mix of classic + recent)

## Example Timeline

| Task | Time | Notes |
|------|------|-------|
| Research map generation | 2-3 min | Automated |
| Level 1-3 adaptation (EN) | 15-20 min | Manual/LLM-assisted |
| Level 4-5 adaptation (EN) | 10-15 min | Can use more research map content |
| Japanese adaptation | 20-30 min | Full cultural adaptation |
| JSON creation | 5 min | Copy/paste into template |
| Review & publish | 5 min | Final checks |
| **Total** | **~60-75 min** | Per topic |

With practice and LLM assistance, can reduce to 30-40 minutes per topic.
