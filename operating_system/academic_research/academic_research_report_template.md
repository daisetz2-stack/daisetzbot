# Academic Research Report Template

## Metadata

**Topic:** [Research query/keyword]  
**Generated:** [Date and time]  
**Papers Analyzed:** [Total count]  
**Date Range:** [Earliest to latest publication year]  
**Data Source:** OpenAlex (https://openalex.org)

---

## Executive Summary

**Research Question:** [One-sentence formulation of the query]

**Key Finding:** [2-3 sentence summary of strongest conclusion]

**Consensus Level:** [STRONG_CONSENSUS | MODERATE_CONSENSUS | WEAK_EVIDENCE | NO_CONSENSUS | INSUFFICIENT_DATA]

**Evidence Quality:** [Overall median evidence strength score]

**Major Fault Lines:** [List primary disputes if present, or "None identified"]

**Practical Implication:** [One actionable takeaway for non-experts]

---

## Evidence Strength Analysis

### High-Strength Papers (evidence_strength ≥ 2.0)

| Paper | Year | Evidence Score | Method | Citations | Key Finding |
|-------|------|----------------|--------|-----------|-------------|
| [Author et al.] | YYYY | X.X | [Meta-analysis/RCT/etc.] | NNN | [Brief finding] |
| ... | ... | ... | ... | ... | ... |

**Calculation Example:**
```
[First paper title]
= method_weight (X) + citation_signal (X) - uncertainty_flag (X)
= evidence_strength: X.X
```

### Medium-Strength Papers (1.0 ≤ evidence_strength < 2.0)

| Paper | Year | Evidence Score | Method | Citations | Key Finding |
|-------|------|----------------|--------|-----------|-------------|
| ... | ... | ... | ... | ... | ... |

### Low-Strength Papers (evidence_strength < 1.0)

| Paper | Year | Evidence Score | Method | Citations | Key Finding |
|-------|------|----------------|--------|-----------|-------------|
| ... | ... | ... | ... | ... | ... |

**Note:** Low-strength papers included for completeness but weighted minimally in conclusions.

---

## Consensus vs. Dispute Mapping

### Consensus Analysis

**Criteria Applied:**
- Minimum papers: ≥3 [✓ | ✗]
- Independent groups: ≥2 [✓ | ✗]
- Median strength: ≥1.0 [✓ | ✗] (actual: X.X)
- Directional agreement: >70% [✓ | ✗] (actual: XX%)

**Classification:** [STRONG_CONSENSUS | MODERATE_CONSENSUS | WEAK_EVIDENCE | NO_CONSENSUS | INSUFFICIENT_DATA]

**Consensus Statement (if applicable):**
> [Hedged claim based on evidence strength]
> Supporting papers: [List 3-5 key papers]

**Dissenting Views (if applicable):**
> [Papers that contradict consensus]
> Reason for exclusion from consensus: [Low quality | Different context | Methodological issues]

### Dispute Map

#### [If disputes detected, use sections below. Otherwise write "No significant disputes detected."]

#### Dispute Type 1: Directional Conflict
**Description:** [Studies finding opposite effects]

**Positive Camp (n=X):**
- [Paper 1]: [Finding + evidence score]
- [Paper 2]: [Finding + evidence score]

**Negative Camp (n=X):**
- [Paper 1]: [Finding + evidence score]
- [Paper 2]: [Finding + evidence score]

**Fault Line:** [Description of core disagreement]

**Possible Explanations:**
- [Methodological difference]
- [Population difference]
- [Other explanation]

---

#### Dispute Type 2: Methodological Conflict

**Sub-type:** [Species | Environment | Scale | Temporal]

**Description:** [How results vary by method dimension]

**Cluster A ([dimension value]):**
- Papers: [List]
- Finding: [Summary]
- Evidence: [Score range]

**Cluster B ([dimension value]):**
- Papers: [List]
- Finding: [Summary]
- Evidence: [Score range]

**Fault Line:** [Specific methodological tension]

**Reconciliation Attempt:**
> [Explanation of why different methods might yield different results]
> [Which cluster is more applicable to real-world scenarios]

---

#### Dispute Type 3: Domain Conflict

**Description:** [Effects differ across application domains]

**Domain A ([field name]):**
- Papers: [List]
- Finding: [Summary]
- Typical context: [Description]

**Domain B ([field name]):**
- Papers: [List]
- Finding: [Summary]
- Typical context: [Description]

**Fault Line:** [Domain-specific effects]

**Context-Dependent Labeling:**
> [Original claim]: [Too broad]
> **Refined claim:** [Claim qualified by domain]

---

#### Dispute Type 4: Uncertainty Conflict

**Description:** [Disagreement about evidence quality]

**Methodological Critiques (n=X):**
- [Paper 1]: [Concern raised]
- [Paper 2]: [Concern raised]

**Common Concerns:**
- [Concern 1]: [Explanation]
- [Concern 2]: [Explanation]

**Affirming Papers (n=X):**
- [Papers defending original findings]

**Fault Line:** [Quality of evidence and interpretation]

**Resolution Status:** [Ongoing | Partially resolved | Unclear]

---

## Context-Dependent Effects

### [If identified, use sections below. Otherwise write "No strong context-dependencies detected."]

**Finding:** [Original broad claim]

**Context A:** [Population/Setting/Method/Dose/Duration]
- **Effect:** [Present | Absent | Mixed]
- **Papers:** [List]
- **Evidence strength:** [Score]

**Context B:** [Different context]
- **Effect:** [Present | Absent | Mixed]
- **Papers:** [List]
- **Evidence strength:** [Score]

**Refined Claim:**
> [Context-qualified statement]
> Applicable to: [Specific contexts]
> Not established for: [Other contexts]

---

## Heterogeneous Results

### [If detected, use section below. Otherwise write "No significant unexplained heterogeneity."]

**Pattern Detected:** [Description of mixed findings]

**Variation Source:** [Method dimension | Domain variation]

**Papers Showing Variation:**
| Paper | Context | Finding | Evidence Score |
|-------|---------|---------|----------------|
| ... | ... | ... | ... |

**Explanation:**
> [Why results might differ]
> [Which context is most relevant depends on: X]

**Recommendation:** [Avoid overgeneralization | Specify context in claims]

---

## Methodological Tensions

**[List specific methodological debates identified across papers]**

### Tension 1: [Name]
- **Nature:** [Description of methodological disagreement]
- **Papers involved:** [List]
- **Impact on conclusions:** [How this affects interpretation]
- **Resolution path:** [What would settle the debate]

### Tension 2: [Name]
- ...

---

## Publication Bias Signals

### Assessment

**Signals Detected (flag if ≥2):**
- [ ] Funnel plot asymmetry mentioned
- [ ] Small-study effects noted
- [ ] Industry funding bias pattern
- [ ] File drawer problem mentioned
- [ ] P-hacking indicators
- [ ] Citation bias (positive studies cited more)

**Details:**
[For each checked signal, provide specifics and paper references]

### Interpretation (with Epistemic Humility)

[If ≥2 signals detected:]
> 📊 **PUBLICATION BIAS WARNING**
>
> Multiple indicators suggest published literature may overestimate effects.
> **Detected signals:** [List]
> **Implication:** Positive findings should be interpreted with caution.
> **Recommendation:** Prioritize pre-registered replications and studies with negative results reported.
> **Caveat:** Absence of detected bias does not prove absence of bias. These signals are suggestive, not definitive.

[If <2 signals:]
> No strong publication bias signals detected in this sample. However, this does not rule out bias—it may reflect limited detection power or genuine absence. Exercise standard caution when interpreting published literature.

---

## Citation Recycling Analysis

### [If detected, use section below. Otherwise write "No citation recycling concerns identified."]

**Warning:** ⚠️ CITATION RECYCLING DETECTED

**Pattern:**
- Reviews analyzed: [N]
- Overlapping core papers: [N]
- Unique primary studies: [N]
- Overlap ratio: [X%]

**Core Papers Being Recycled:**
1. [Paper 1] - Cited in [X] reviews
2. [Paper 2] - Cited in [X] reviews
3. ...

**Implication:**
> Apparent consensus may reflect a limited primary evidence base rather than independent replication. The [N] reviews effectively cite the same [N] core studies, creating an illusion of broader support.

**Recommendation:**
> Prioritize new primary studies over additional reviews. Evidence base needs expansion before strong conclusions warranted.

---

## Knowledge Topology Map

### Four-Dimensional Visualization

```
EPISTEMIC CERTAINTY (Y-axis)
         ▲
         │
    HIGH │        [Meta-A]●○○            LEGEND:
         │           ↑                   ● = High certainty
         │        [RCT-2]●               ○ = Emerging (last 3 yrs)
  MEDIUM │   [Long]□     [RCT-1]●        □ = Stable (5-15 yrs)
         │                               △ = Legacy (>15 yrs)
     LOW │  [Obs-A]△  [Obs-B]△           
         │                               Size indicates domain breadth:
  THEORY │  [Opinion]△                   Large = 4+ fields
         │                               Medium = 2-3 fields
         └─────────────────────────────► CONSENSUS (X-axis)
          DISPUTE    MIXED    CONSENSUS
           <50%     50-70%      >70%

FAULT LINES:
→ [Description of intellectual divide 1]
→ [Description of intellectual divide 2]
```

### Landscape Interpretation

**Mature Clusters:**
- [Papers in high-certainty/high-consensus zone]
- Interpretation: [Well-established findings]

**Emerging Clusters:**
- [Recent papers with rapid citations]
- Interpretation: [New directions gaining traction]

**Disputed Territory:**
- [Papers in low-consensus zones]
- Interpretation: [Active debates, conflicting evidence]

**Frontier Areas:**
- [Gaps in the topology]
- Interpretation: [Research needed here]

---

## Recommendations for Further Research

### Critical Gaps
1. **[Gap 1]:** [Description]
   - **Why critical:** [Explanation]
   - **Suggested study design:** [Method]
   - **Expected impact:** [How this would advance field]

2. **[Gap 2]:** ...

### Methodological Improvements
1. **[Improvement 1]:** [Description]
   - **Current limitation:** [Problem]
   - **Proposed solution:** [Method]
   - **Feasibility:** [Assessment]

2. **[Improvement 2]:** ...

### Replication Priorities
[List specific findings that need independent replication]
1. [Paper/finding] - **Reason:** [Why replication needed]
2. ...

### Context-Expansion Studies
[Areas where applicability boundaries need testing]
1. **Current context:** [Established domain]
   **Expand to:** [New population/setting/method]
   **Research question:** [Specific testable question]

---

## Conclusions

### Summary of Evidence Quality

**Overall assessment:** [1-2 paragraph synthesis of evidence landscape]

**Strength distribution:**
- High (≥2.0): [N papers, X%]
- Medium (1.0-1.9): [N papers, X%]
- Low (<1.0): [N papers, X%]

**Consensus status:** [Final classification with justification]

### Hedged Claims (by Evidence Strength)

**Strong evidence (≥3.0):**
> [Claims supported by meta-analyses/RCTs with high citations]

**Moderate evidence (2.0-2.9):**
> [Claims supported by RCTs or strong longitudinal studies]

**Limited evidence (1.0-1.9):**
> [Claims with preliminary support but needing replication]

**Weak/Contradictory evidence (<1.0):**
> [Claims with insufficient support - note as speculative]

### Practical Implications

**For practitioners:**
[Actionable guidance with appropriate caveats]

**For policymakers:**
[Evidence-based recommendations with uncertainty bounds]

**For researchers:**
[Priority areas and methodological suggestions]

### Final Note on Uncertainty

> This analysis represents a snapshot of published academic literature as of [date]. Science is an evolving process—new evidence may strengthen, weaken, or contextualize these conclusions. The absence of evidence is not evidence of absence. All claims should be held provisionally and updated as new research emerges.

---

## Appendix: Full Paper List

[Alphabetical list of all papers analyzed, with OpenAlex IDs and evidence scores]

1. [Author, Year]. [Title]. *[Journal]*. Evidence score: X.X. OpenAlex: [ID]
2. ...

---

## Methodology Note

**Evidence Strength Formula:**
```
evidence_strength = method_weight + citation_signal - uncertainty_flag
```

**Method Weights:** Meta-analysis (+3), RCT (+2), Longitudinal (+1), Observational (0), Theory (-1)

**Citation Signal:** Based on log(citations+1) / publication age, capped at 1.5

**Uncertainty Penalties:** Heterogeneity (+1.0), Small sample (+0.5), Replication failure (+1.0), COI (+0.5)

**Consensus Criteria:**
- Minimum 3 papers from 2+ independent author groups
- Median evidence strength ≥1.0
- Directional agreement >70%

**Data Source:** OpenAlex (CC0 1.0 Universal Public Domain)

---

**Report Generated by:** thepopebot Academic Research Agent  
**Version:** 1.0  
**Contact:** [Repository URL]
