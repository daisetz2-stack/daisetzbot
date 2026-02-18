Create a specialized academic research agent with epistemic rigor and robustness safeguards.

**Directory Structure to Create:**
```
operating_system/academic_research/
├── academic_research.md              # Agent behavior & methodology
├── academic_research_report_template.md  # Output format specification  
└── academic_research_report.md       # Generated reports (overwritten each run)
```

**File 1: academic_research.md**
Define the agent's core behavior:
- Triggered by `/academic_research [keyword/topic]` or calls from other agents
- Uses OpenAlex API for academic paper retrieval and analysis
- Implements robust evidence scoring and dispute detection
- Maps intellectual fault lines with four-dimensional knowledge topology

**File 2: academic_research_report_template.md**
Specify structured output format including:
- Executive summary with key findings
- Evidence strength analysis
- Consensus vs dispute mapping
- Context-dependent effects
- Methodological tensions
- Publication bias signals
- Recommendations for further research

**File 3: academic_research_report.md**
Initial template that gets overwritten with actual research results

**Core Implementation Features:**
- Evidence strength scoring: method_weight + citation_signal - uncertainty_flag
- Citation velocity: `min(log(citations+1) / max(1, current_year-year), cap)`
- Method weights: meta-analysis +3, RCT +2, longitudinal +1, observational 0, theory -1
- Consensus requirements: ≥3 papers + ≥2 author groups + median evidence_strength ≥1
- Heterogeneous results: mixed findings + (method OR domain variation)
- Citation recycling detection: reviews + overlapping cores + primary count <5
- Context-dependent labeling when claims differ across domain clusters
- Publication bias flagging with humble phrasing
- Four conflict types: direction, method (species/environment/scale/temporal), domain, uncertainty

The agent should be production-ready with numerical safeguards and epistemic humility built in.