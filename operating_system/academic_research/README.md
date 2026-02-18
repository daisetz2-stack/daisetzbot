# Academic Research Agent - System Documentation

**Created:** 2026-02-18  
**Version:** 1.0  
**Status:** Production-ready

---

## Overview

This directory contains a specialized academic research agent designed with epistemic rigor, numerical safeguards, and robust dispute detection. The agent retrieves and analyzes academic papers from OpenAlex API, scores evidence strength, detects consensus vs disputes, and generates comprehensive research reports.

---

## Directory Structure

```
operating_system/academic_research/
├── academic_research.md                      # Core agent behavior & methodology (291 lines)
├── academic_research_report_template.md      # Structured output specification (327 lines)
├── academic_research_report.md               # Generated reports (overwritten each run)
└── README.md                                 # This file
```

---

## Key Features

### 1. Evidence Strength Scoring

**Formula:**
```
evidence_strength = method_weight + citation_signal - uncertainty_flags
```

**Method weights:**
- Meta-analysis / Systematic review: **+3**
- Randomized Controlled Trial (RCT): **+2**
- Longitudinal / Cohort study: **+1**
- Cross-sectional / Observational: **0**
- Theoretical / Opinion: **-1**

**Citation signal:**
```
citation_velocity = min(log(citations + 1) / max(1, current_year - year), 2.5)
citation_signal = citation_velocity / 2.5  # Normalized to 0-1 scale
```

**Uncertainty flags** (subtract from score):
- Mixed results: **-0.5**
- Small sample (N<100): **-0.3**
- Preprint: **-0.2**
- High p-value: **-0.3**
- Replication concern: **-0.5**

**Interpretation scale:**
- **≥ 2.5**: Very strong evidence
- **1.5 - 2.4**: Strong evidence
- **0.5 - 1.4**: Moderate evidence
- **-0.5 - 0.4**: Weak evidence
- **< -0.5**: Very weak evidence

### 2. Consensus Detection

**Criteria (all must be met):**
1. Paper count ≥ **3**
2. Author diversity ≥ **2** independent groups
3. Median evidence strength ≥ **1.0**
4. Directional agreement ≥ **75%**
5. No major disputes in recent work (≤5 years)

**Labels:**
- Strong consensus
- Moderate consensus
- Emerging consensus (3-4 papers only)

### 3. Dispute Taxonomy

**Four types:**
1. **Direction**: X increases Y vs X decreases Y
2. **Method**: Effect varies by study design (species/environment/scale/temporal)
3. **Domain**: Effect varies by population, context, or conditions
4. **Uncertainty**: Papers explicitly disagree on certainty level

### 4. Context-Dependent Effects

**Four-dimensional knowledge topology:**
1. **Method axis**: Evidence variation by study design
2. **Domain axis**: Which fields/populations show the effect
3. **Time axis**: Temporal evolution of findings
4. **Uncertainty axis**: Where authors express most doubt

**Context-conditional labeling:**
```
Claim: [X affects Y in context A] (evidence: strong)
Claim: [X does NOT affect Y in context B] (evidence: moderate)
Note: Context-dependent effect detected.
```

### 5. Citation Recycling Detection

**Warning triggers:**
- Review paper proportion >**40%**
- Primary research count <**5**
- Citation cascade: one paper dominates all reviews
- Overlapping citation cores across reviews

**Response:**
- Downweight review evidence by **30%**
- Prioritize primary research
- Explicitly state unique empirical study count

### 6. Publication Bias Assessment

**Signals:**
- Asymmetric findings (>**90%** positive results)
- Lack of null findings
- Industry funding prevalence
- Small study effects (smaller studies → larger effects)
- Recent replication failures

**Phrasing:**
- Use humble language: "may suffer from", "potential for", "suggestive of"
- Never definitively claim bias without direct evidence
- Note alternative explanations

### 7. Methodological Tensions

**Common tensions identified:**
- Species mismatch (animal vs human studies)
- Environmental validity (lab vs field)
- Scale issues (individual vs population)
- Temporal dynamics (short-term vs long-term)
- Measurement problems (operationalization differences)

---

## Usage

### Activation Methods

1. **Telegram command:**
   ```
   /academic_research [keyword/topic]
   ```

2. **Natural language query:**
   ```
   What does the research say about caffeine and cognitive performance?
   ```

3. **Programmatic call:**
   - Another agent calls with research query
   - Webhook trigger with research parameters
   - Cron job for scheduled literature monitoring

### Input Format

- **Simple:** `/academic_research caffeine cognitive performance`
- **Complex:** `/academic_research Does exercise improve depression symptoms in adolescents?`
- **Focused:** `/academic_research sleep deprivation memory RCTs only`

### Output Location

- **Generated report:** `operating_system/academic_research/academic_research_report.md`
- **Report structure:** Follows `academic_research_report_template.md`
- **Behavior:** File is **overwritten** on each run (previous reports replaced)

---

## Report Structure

All generated reports include:

1. **Executive Summary** - Key findings, confidence, caveats
2. **Evidence Strength Analysis** - Paper scoring distribution and top-ranked studies
3. **Consensus vs Dispute Mapping** - Where researchers agree/disagree
4. **Context-Dependent Effects** - Four-dimensional topology
5. **Methodological Tensions** - Design-dependent variations
6. **Publication Bias Signals** - Bias risk assessment
7. **Citation Recycling Analysis** - Evidence base breadth
8. **Recommendations for Further Research** - High-priority gaps
9. **Limitations of This Analysis** - Methodological caveats
10. **Epistemic Disclaimers** - Humble safeguards
11. **Appendix: Full Paper List** - Complete metadata
12. **Metadata** - Generation details

---

## OpenAlex API Integration

### API Details

- **Endpoint:** `https://api.openalex.org/works`
- **Cost:** Free (no API key required)
- **Rate limit:** ~100k requests/day
- **Coverage:** 250M+ works from 250k+ venues
- **Documentation:** https://docs.openalex.org

### Query Parameters

- `search={keyword}` - Primary search term
- `filter=is_paratext:false` - Exclude editorials/corrections
- `sort=relevance_score:desc` - Sort by relevance + citations
- `per-page=50` - Results per page (max 200)
- `cursor=*` - Pagination token for large result sets

### Retrieved Fields

Per paper:
- Identifiers (id, doi)
- Metadata (title, year, type)
- Authors (authorships with institutions)
- Impact (cited_by_count)
- Topics (primary_topic, concepts)
- Content (abstract_inverted_index)
- Access (open_access.oa_url)

---

## Error Handling

### API Failures

- **Retry logic:** 3 attempts with exponential backoff (2s, 4s, 8s)
- **Abort message:** "OpenAlex API unavailable. Cannot complete research."

### Insufficient Data

- **<5 papers found:** "Insufficient academic literature. Consider broader search terms."
- **All reviews, no primary research:** "No primary research found. Results may reflect citation recycling."
- **Missing abstracts:** Use title + concepts for basic analysis, note limitation

### Edge Cases

- **All papers >10 years old:** Flag as "Potentially outdated research."
- **Papers span >5 domains:** "Topic too broad. Consider narrowing focus."

---

## Epistemic Safeguards

### Always Included Disclaimers

1. "This analysis is based on automated retrieval and scoring. Human expert review is recommended."
2. "Evidence strength scores are heuristic approximations, not definitive quality assessments."
3. "OpenAlex coverage is extensive but not exhaustive. Some relevant papers may be missing."
4. "Context, implementation details, and individual variation may affect real-world applicability."

### Language Guidelines

**Avoid:**
- "proves", "definitively shows", "confirms"

**Prefer:**
- "suggests", "provides evidence for", "indicates"

**When uncertain:**
- "unclear", "mixed evidence", "requires further research"

**For disputes:**
- "contested", "debated", "conflicting findings"

---

## Integration with Other Agents

### Collaboration Modes

1. **Deep dive** (default): Full report generation
2. **Quick scan**: Executive summary only (10 papers, basic scoring)
3. **Targeted**: Focus on specific sub-question (e.g., "only RCTs", "only recent")

### Return Formats

- **Human-readable:** Full markdown report
- **Structured:** JSON format with confidence intervals
- **Flagged:** Epistemic red flags (recycling, bias, disputes)

---

## Example Workflow

**Input:** `/academic_research caffeine cognitive performance`

**Processing steps:**
1. Query OpenAlex for "caffeine cognitive performance" papers
2. Retrieve top 30 results with full metadata
3. Score each paper: method + citations - uncertainty
4. Cluster by findings: improves / no effect / impairs
5. Calculate consensus: 18 improvement (median=1.6), 2 null (median=0.4)
6. Detect heterogeneity: stronger for complex tasks vs simple
7. Check citation recycling: 22 primary + 8 reviews (63% primary - OK)
8. Assess publication bias: 90% positive - note potential bias
9. Identify tensions: acute vs chronic effects differ
10. Generate report following template
11. Save to `academic_research_report.md`

**Output:** 703-line comprehensive report with executive summary, evidence analysis, consensus map, context effects, methodological tensions, bias assessment, research recommendations, and full epistemic disclaimers.

---

## Validation & Testing

### Test Queries

**Well-established topics:**
- `/academic_research smoking causes lung cancer` (expect: strong consensus)
- `/academic_research vitamin C common cold` (expect: weak/disputed)

**Emerging topics:**
- `/academic_research psychedelic therapy PTSD` (expect: emerging consensus)
- `/academic_research AI alignment safety` (expect: insufficient data)

**Context-dependent:**
- `/academic_research intermittent fasting weight loss` (expect: heterogeneity by protocol)
- `/academic_research screen time child development` (expect: domain disputes)

### Quality Checks

- Evidence strength scores align with manual expert assessment
- Consensus detection matches field expert opinion
- Publication bias signals correspond to known biases (e.g., psych replication crisis)
- Context-dependent effects properly labeled
- Citation recycling detected in known echo chambers

---

## Maintenance & Updates

### Review Cycle

- **Quarterly methodology audits** (check formula validity)
- **Annual OpenAlex API compatibility check**
- **Ongoing epistemic safeguard refinement**

### Versioning

- **Current version:** 1.0 (2026-02-18)
- **Changelog location:** This README (updates section)
- **Breaking changes:** Noted in SOUL.md agent identity

### Future Enhancements

**Potential additions:**
- Full-text analysis (beyond abstracts)
- Meta-regression for effect modifiers
- Automated funnel plot generation for publication bias
- Integration with other databases (PubMed, Semantic Scholar)
- LLM-based methodology extraction (GPT-4 for study design classification)
- Citation network visualization

---

## References

**Methodology inspired by:**
- GRADE system (Grading of Recommendations Assessment, Development and Evaluation)
- Scientometric literature (citation velocity)
- Egger's test and funnel plot asymmetry (publication bias)
- Tetlock's superforecasting research (epistemic humility)

**Key papers:**
- Guyatt et al. (2008) "GRADE: an emerging consensus on rating quality of evidence"
- Egger et al. (1997) "Bias in meta-analysis detected by a simple graphical test"
- Ioannidis (2005) "Why most published research findings are false"
- Tetlock & Gardner (2015) "Superforecasting: The Art and Science of Prediction"

---

## Contact & Support

**Maintained by:** thepopebot system  
**Documentation:** This README + inline comments in `.md` files  
**Issues:** Report via GitHub repository issues  
**Updates:** Track via git commit history

---

**Last updated:** 2026-02-18  
**Documentation version:** 1.0  
**Agent version:** 1.0

---

## Quick Reference Card

| Task | Command | Output Location |
|------|---------|----------------|
| Run research | `/academic_research [topic]` | `academic_research_report.md` |
| Check template | Read `academic_research_report_template.md` | N/A |
| View methodology | Read `academic_research.md` | N/A |
| Last report | Read `academic_research_report.md` | N/A |

| Formula | Expression |
|---------|------------|
| Evidence strength | `method_weight + citation_signal - uncertainty_flags` |
| Citation velocity | `min(log(citations+1) / max(1, year_diff), 2.5)` |
| Consensus threshold | `≥3 papers, ≥2 groups, median≥1.0, ≥75% agreement` |
| Recycling threshold | `reviews>40% AND primary<5` |

| Evidence Scale | Range | Interpretation |
|---------------|-------|----------------|
| Very strong | ≥2.5 | Meta-analyses, high-powered RCTs |
| Strong | 1.5-2.4 | Solid RCTs, robust observational |
| Moderate | 0.5-1.4 | Decent studies with limitations |
| Weak | -0.5-0.4 | Observational, small samples |
| Very weak | <-0.5 | Theoretical, high uncertainty |

---

**This agent is production-ready and implements all specified epistemic safeguards.**
