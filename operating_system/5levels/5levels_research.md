# 5 Levels Research Methodology

## Purpose

This document defines the comprehensive research process for the `/5levels` command. When a user provides a keyword or topic, you will conduct progressive, multi-level research that builds from foundational understanding to advanced insights.

## Research Process Overview

The 5 Levels research methodology is designed to:
1. Start with accessible, foundational knowledge
2. Progressively deepen understanding at each level
3. Build upon previous findings systematically
4. Deliver actionable insights and expert perspectives
5. Present comprehensive, well-sourced information

## The 5 Levels Framework

### Level 1: Foundation & Overview (ELI5)
**Objective:** Establish basic understanding accessible to anyone

**Research Focus:**
- Simple, clear definition of the topic
- Why this topic matters
- Basic context and relevance
- Key terminology (explained simply)
- Common misconceptions to clarify

**Research Methods:**
- Search for introductory articles and explainers
- Look for "What is [keyword]?" content
- Find analogies and simple explanations
- Identify the most basic facts everyone should know

**Deliverables:**
- 2-3 sentence core definition
- 3-5 key foundational facts
- 1-2 helpful analogies or examples
- List of basic terminology

---

### Level 2: Core Concepts & Components
**Objective:** Break down the topic into its essential parts

**Research Focus:**
- Main components, elements, or aspects
- How the parts relate to each other
- Historical context or origin story
- Fundamental principles or theories
- Key figures or contributors

**Research Methods:**
- Search for educational content and overviews
- Look for "How does [keyword] work?" explanations
- Find historical background
- Identify primary sources or foundational papers
- Map out the structure or taxonomy

**Deliverables:**
- Breakdown of 4-6 core components
- Timeline or origin story (if applicable)
- Key principles or mechanisms
- Notable contributors or sources
- Visual structure or framework (described)

---

### Level 3: Deep Dive & Technical Details
**Objective:** Explore the mechanics, processes, and technical aspects

**Research Focus:**
- Detailed mechanisms and processes
- Technical specifications or characteristics
- Scientific or theoretical foundations
- Data, statistics, and evidence
- Current state of knowledge
- Variations, types, or categories

**Research Methods:**
- Search for technical documentation
- Look for academic papers or research studies
- Find expert explanations and analyses
- Gather quantitative data and statistics
- Identify different schools of thought or approaches
- Review case studies or detailed examples

**Deliverables:**
- Detailed explanation of mechanisms
- Relevant data, statistics, or metrics
- Technical characteristics or specifications
- Evidence from research or studies
- Categorization of types or variations

---

### Level 4: Applications, Implications & Impact
**Objective:** Understand real-world applications and significance

**Research Focus:**
- Practical applications and use cases
- Impact on society, industry, or field
- Benefits and advantages
- Challenges, limitations, and criticisms
- Ethical considerations (if applicable)
- Economic or social implications
- Success stories and failures

**Research Methods:**
- Search for industry applications and case studies
- Look for impact assessments and analyses
- Find discussions of challenges and limitations
- Identify ethical debates or controversies
- Review implementation examples
- Gather expert opinions on significance

**Deliverables:**
- 5-7 major application areas
- Impact assessment (positive and negative)
- Key challenges and limitations
- Ethical or controversial aspects
- Notable success stories or case studies
- Expert perspectives on significance

---

### Level 5: Advanced Perspectives & Future Directions
**Objective:** Explore cutting-edge developments and expert insights

**Research Focus:**
- Latest developments and innovations
- Emerging trends and future directions
- Unsolved problems or open questions
- Expert debates and different perspectives
- Connections to broader themes or fields
- Predictions and forecasts
- Frontier research or bleeding-edge applications

**Research Methods:**
- Search for recent research papers and preprints
- Look for expert interviews and opinion pieces
- Find conference proceedings or talks
- Identify emerging startups or projects
- Review futurist predictions or forecasts
- Seek out contrarian or alternative viewpoints
- Connect to related fields or interdisciplinary insights

**Deliverables:**
- 3-5 cutting-edge developments
- Key unsolved problems or challenges
- Expert debates or competing perspectives
- Future predictions or scenarios
- Connections to related domains
- Frontier research or innovation areas

---

## Research Execution Guidelines

### 1. Web Research Strategy

**Use brave-search skill for:**
- Initial keyword exploration
- Finding authoritative sources
- Gathering diverse perspectives
- Locating specific data or examples
- Verifying claims and facts

**Search Query Patterns:**
- Level 1: "[keyword] explained", "what is [keyword]", "[keyword] for beginners"
- Level 2: "how [keyword] works", "[keyword] components", "history of [keyword]"
- Level 3: "[keyword] technical details", "[keyword] research", "[keyword] data statistics"
- Level 4: "[keyword] applications", "[keyword] impact", "[keyword] challenges"
- Level 5: "future of [keyword]", "[keyword] latest research", "[keyword] expert opinion"

**Source Quality Criteria:**
- Prioritize authoritative sources (educational institutions, research organizations)
- Include diverse perspectives (academic, industry, popular science)
- Verify information across multiple sources
- Note publication dates (especially for Level 5)
- Cite specific sources for key claims

### 2. Information Synthesis

For each level:
1. **Gather** - Collect 3-5 quality sources minimum
2. **Extract** - Pull out key facts, quotes, and insights
3. **Synthesize** - Combine information into coherent narrative
4. **Verify** - Cross-check facts across sources
5. **Connect** - Link findings to previous levels

### 3. Progressive Building

- **Level 1 → 2:** Use foundational understanding to identify which core concepts to explore
- **Level 2 → 3:** Use knowledge of components to dive into technical details
- **Level 3 → 4:** Use technical understanding to analyze real-world applications
- **Level 4 → 5:** Use application insights to explore future possibilities

Each level should naturally flow from and build upon the previous one.

### 4. Source Documentation

Maintain a comprehensive source list throughout research:
- Document URL, title, author, date for each source
- Note which level each source contributes to
- Highlight particularly authoritative or useful sources
- Include a mix of source types (academic, news, technical docs, expert blogs)

### 5. Quality Checks

Before moving to the next level, ensure:
- ✅ All research objectives for current level are met
- ✅ Information is accurate and cross-verified
- ✅ Content flows logically from previous level
- ✅ Sources are documented
- ✅ Level provides unique insights (not repetitive)

---

## Output Format

Once research is complete, use the template at `operating_system/5levels/5levels_report_template.md` to structure your findings.

The final report should be:
- **Comprehensive:** Covers all 5 levels thoroughly
- **Progressive:** Each level builds naturally on previous ones
- **Well-sourced:** Every major claim is backed by sources
- **Accessible:** Level 1 is simple, complexity increases gradually
- **Insightful:** Provides genuine value at each level
- **Actionable:** Includes practical takeaways

---

## Integration Notes

### Trigger Setup

This research process is designed to work with thepopebot's trigger system. The `/5levels [keyword]` command should:

1. Extract the keyword from user input
2. Create an agent job with task: "Read operating_system/5levels/5levels_research.md and conduct comprehensive 5-level research on: [keyword]"
3. Agent performs research following this methodology
4. Agent generates report using 5levels_report_template.md
5. Agent saves completed report to `operating_system/5levels/5levels_report.md`
6. User receives notification with research summary

### Session Management

Each research session should:
- Document the keyword being researched
- Track progress through the 5 levels
- Save intermediate findings
- Generate timestamped report
- Log all sources used

### Time Management

Research time per level (approximate):
- Level 1: 5-10 minutes (quick foundational search)
- Level 2: 10-15 minutes (core concept mapping)
- Level 3: 15-20 minutes (technical deep dive)
- Level 4: 15-20 minutes (application research)
- Level 5: 10-15 minutes (frontier exploration)

**Total estimated time:** 55-80 minutes per keyword

---

## Best Practices

### Do:
- ✅ Start broad, then narrow focus at each level
- ✅ Use multiple diverse sources per level
- ✅ Verify facts across independent sources
- ✅ Include specific examples and case studies
- ✅ Note when information is uncertain or debated
- ✅ Connect findings across levels
- ✅ Cite sources inline throughout the report
- ✅ Highlight surprising or counterintuitive findings

### Don't:
- ❌ Rush through levels without thorough research
- ❌ Repeat the same information at multiple levels
- ❌ Rely on a single source for major claims
- ❌ Include outdated information (especially at Level 5)
- ❌ Make claims without source backing
- ❌ Skip verification of key facts
- ❌ Ignore contrary viewpoints or criticisms
- ❌ Present opinion as fact

---

## Example Research Flow

**Keyword:** "Quantum Computing"

1. **Level 1 Research:**
   - Search: "quantum computing explained simply"
   - Find: ELI5 explanation, basic analogy to classical computing
   - Output: Simple definition, why it matters, key difference from regular computers

2. **Level 2 Research:**
   - Search: "quantum computing principles", "qubits explained"
   - Find: Core concepts (qubits, superposition, entanglement)
   - Output: Breakdown of key components, history, key figures (Feynman, Shor)

3. **Level 3 Research:**
   - Search: "quantum computing technical details", "quantum algorithms"
   - Find: Technical papers, algorithm descriptions, current qubit counts
   - Output: Detailed mechanics, quantum gates, error correction, current specs

4. **Level 4 Research:**
   - Search: "quantum computing applications", "quantum computing challenges"
   - Find: Use cases (cryptography, drug discovery), limitations (decoherence)
   - Output: Application areas, impact on industries, current challenges

5. **Level 5 Research:**
   - Search: "quantum computing 2024 breakthrough", "future of quantum computing"
   - Find: Recent papers, IBM/Google developments, expert predictions
   - Output: Latest advances, unsolved problems, future scenarios, expert debates

**Result:** Comprehensive 5-level report ready for user consumption

---

## Continuous Improvement

After each research session, consider:
- What worked well in the research process?
- Which sources were most valuable?
- What could be improved for next time?
- Were there gaps in the research?
- Did each level provide unique value?

Use these insights to refine future research approaches.
