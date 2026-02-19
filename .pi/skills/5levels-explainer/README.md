# 5 Levels Research Agent System

## Overview

The 5 Levels Research Agent System enables daisetz to perform comprehensive, multi-level research on any given keyword or topic. When triggered with `/5levels [keyword]`, the agent conducts progressive research from foundational understanding to cutting-edge developments, producing a detailed, well-sourced report.

## System Architecture

```
/5levels [keyword] command
         ↓
Trigger System (TRIGGERS.json)
         ↓
Create Job: "Read .pi/skills/5levels-explainer/5levels_research.md and research: [keyword]"
         ↓
Docker Agent (Pi + brave-search skill)
         ↓
Level 1 → Level 2 → Level 3 → Level 4 → Level 5 Research
         ↓
Generate Report using 5levels_report_template.md
         ↓
Save to logs/[JOB_ID]/5levels_report.md
         ↓
Notification to User
```

## Core Files

### 1. `5levels_research.md`
**Purpose:** Defines the research methodology and process

**Contains:**
- The 5 Levels framework (Foundation → Core Concepts → Deep Dive → Applications → Advanced)
- Research objectives for each level
- Web research strategies and query patterns
- Information synthesis guidelines
- Quality checks and best practices

**Usage:** Referenced by job descriptions to guide the agent's research process

### 2. `5levels_report_template.md`
**Purpose:** Defines the structure and format of research reports

**Contains:**
- Complete report structure with all sections
- Markdown formatting standards
- Section-by-section templates
- Metadata and documentation requirements

**Usage:** Agent uses this as scaffolding when generating the final report

### 3. `5levels_report.md`
**Purpose:** Example/demonstration report

**Contains:**
- A complete 5 Levels research report on "Neural Networks"
- Shows what a finished report looks like
- Demonstrates proper formatting, sourcing, and comprehensiveness

**Usage:** Reference for understanding expected output quality

### 4. `README.md` (this file)
**Purpose:** System documentation and integration instructions

## The 5 Levels Framework

### Level 1: Foundation & Overview (ELI5)
- Simple definitions accessible to anyone
- Why the topic matters
- Basic terminology and facts
- Common misconceptions

### Level 2: Core Concepts & Components
- Breaking down into essential parts
- Historical context and origin
- Fundamental principles
- Key contributors

### Level 3: Deep Dive & Technical Details
- Detailed mechanisms and processes
- Scientific/theoretical foundations
- Data, statistics, and evidence
- Types, categories, and variations

### Level 4: Applications, Implications & Impact
- Real-world applications and use cases
- Impact assessment (positive and negative)
- Challenges and limitations
- Case studies and expert perspectives

### Level 5: Advanced Perspectives & Future Directions
- Latest developments and innovations
- Emerging trends
- Unsolved problems and expert debates
- Future predictions and frontier research

## Integration with daisetz

### Option 1: Telegram Command via Chat Interface

The Claude chat system can handle `/5levels [keyword]` commands using the `create_job` tool.

**How it works:**
1. User sends `/5levels quantum computing` in Telegram
2. Claude chat detects the command pattern
3. Creates job with task: "Read .pi/skills/5levels-explainer/5levels_research.md and conduct comprehensive 5-level research on: quantum computing"
4. Agent executes research and generates report
5. User receives notification with summary

**Implementation:** The chatbot system prompt (`CHATBOT.md`) should include:

```markdown
When users send `/5levels [keyword]`, create a research job:
- Task: "Read the file at .pi/skills/5levels-explainer/5levels_research.md and conduct comprehensive 5-level research on: [keyword]"
- Notify the user that research is starting and will take 1-2 hours
```

### Option 2: Webhook Trigger

Add a trigger in `operating_system/TRIGGERS.json`:

```json
{
  "name": "5levels-research",
  "watch_path": "/webhook",
  "actions": [
    {
      "type": "agent",
      "job": "Read the file at .pi/skills/5levels-explainer/5levels_research.md and conduct comprehensive 5-level research on: {{body.keyword}}"
    }
  ],
  "enabled": true
}
```

**Usage:**
```bash
curl -X POST https://your-bot-url.com/webhook \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"keyword": "quantum computing"}'
```

### Option 3: Scheduled Research (Cron)

Add to `operating_system/CRONS.json` for periodic research on pre-defined topics:

```json
{
  "name": "weekly-tech-research",
  "schedule": "0 0 * * 1",
  "type": "agent",
  "job": "Read the file at .pi/skills/5levels-explainer/5levels_research.md and conduct comprehensive 5-level research on: [topic from trending list]",
  "enabled": true
}
```

## Expected Research Duration

- **Level 1:** 5-10 minutes (foundational search)
- **Level 2:** 10-15 minutes (core concept mapping)
- **Level 3:** 15-20 minutes (technical deep dive)
- **Level 4:** 15-20 minutes (application research)
- **Level 5:** 10-15 minutes (frontier exploration)
- **Report generation:** 10-15 minutes (synthesis and formatting)

**Total:** ~60-90 minutes per keyword

## Output Location

Research reports are saved in the job log directory:
```
logs/[JOB_ID]/5levels_report.md
```

The agent should commit this file so it's preserved in the repository history.

## Required Skills

The 5 Levels research system depends on:

1. **brave-search skill** - For web research at each level
   - Must be configured with `BRAVE_API_KEY` in `LLM_SECRETS`
   - Used to search for sources, gather information, and verify facts

2. **Pi coding agent** - Core system that executes the research process
   - Reads the methodology document
   - Conducts progressive research
   - Synthesizes findings into report format

## Customization Options

### Adjusting Research Depth

Edit `5levels_research.md` to modify:
- Number of sources required per level
- Time allocation per level
- Specific research objectives
- Quality criteria

### Modifying Report Format

Edit `5levels_report_template.md` to:
- Add or remove sections
- Change formatting style
- Adjust metadata requirements
- Customize structure

### Domain-Specific Research

Create specialized variants:
- `5levels_research_scientific.md` - For scientific topics
- `5levels_research_business.md` - For business/market research
- `5levels_research_technical.md` - For pure technical deep dives

Update job descriptions to reference the appropriate methodology file.

## Quality Assurance

The system includes several quality checks:

1. **Progressive Building:** Each level builds on previous findings
2. **Source Verification:** Multiple sources required per major claim
3. **Completeness Checks:** All research objectives must be met
4. **Cross-verification:** Facts checked across independent sources
5. **Bias Detection:** Encourages diverse perspectives

## Best Practices

### For Users:
- Be specific with keywords (better: "quantum error correction" than "quantum")
- Allow 1-2 hours for comprehensive research
- Review the executive summary first, then dive into levels of interest
- Check the source list for further reading

### For Developers:
- Keep methodology and template files in sync
- Test with diverse topics (technical, social, historical, etc.)
- Monitor research quality and adjust methodology as needed
- Update example report periodically to reflect current best practices

## Troubleshooting

### Research Incomplete
- **Cause:** Brave API rate limits or timeouts
- **Solution:** Add retry logic; adjust time allocation per level

### Low-Quality Sources
- **Cause:** Poor search queries or limited available information
- **Solution:** Review query patterns in methodology; use alternative search strategies

### Report Too Long
- **Cause:** Excessive detail at each level
- **Solution:** Set word count targets per section in template

### Missing Citations
- **Cause:** Agent not documenting sources during research
- **Solution:** Emphasize source tracking in methodology; require inline citations

## Examples

### Example 1: Technical Topic
```
/5levels neural networks
```
Result: Comprehensive report from ELI5 explanation through cutting-edge research

### Example 2: Scientific Concept
```
/5levels CRISPR gene editing
```
Result: Foundation → mechanisms → applications → ethical debates → future directions

### Example 3: Business Concept
```
/5levels decentralized autonomous organizations
```
Result: Definition → components → technical details → use cases → trends

### Example 4: Historical Topic
```
/5levels Renaissance
```
Result: Overview → key figures → cultural changes → impact → modern influence

## Future Enhancements

Potential improvements to consider:

1. **Multilingual Research:** Support research in multiple languages
2. **Visual Integration:** Generate diagrams, charts, timelines
3. **Interactive Reports:** Links to related topics, collapsible sections
4. **Comparative Research:** Compare 2-3 related topics side-by-side
5. **Research Tracking:** Dashboard showing completed research topics
6. **Collaborative Filtering:** Suggest related topics based on past research
7. **Summary Variants:** Generate short, medium, long versions
8. **Expert Review:** Option to submit reports for human expert validation

## Version History

- **v1.0 (2024-02-18):** Initial release
  - Core methodology document
  - Report template
  - Example report (Neural Networks)
  - Integration documentation

## Contributing

To improve the 5 Levels system:

1. Research topics and note what worked well / poorly
2. Identify gaps in the methodology
3. Suggest template improvements
4. Share example reports that demonstrate excellence
5. Propose enhancements to research process

## License

Part of daisetz system. See repository LICENSE file.

---

## Quick Start Guide

**For first-time use:**

1. Ensure brave-search skill is configured with API key
2. Test with a well-documented topic: `/5levels machine learning`
3. Review the generated report against the example
4. Adjust methodology if needed based on results
5. Roll out to production use

**Minimum viable trigger configuration:**

```json
{
  "name": "5levels-command",
  "watch_path": "/telegram/webhook",
  "actions": [{
    "type": "agent",
    "job": "Read .pi/skills/5levels-explainer/5levels_research.md and research: {{body.message.text}}"
  }]
}
```

**Expected first run:**
- Duration: 60-90 minutes
- Output: ~8,000-15,000 word report
- Sources: 30-50 citations
- Quality: Comprehensive, well-structured, actionable

---

*For questions or issues with the 5 Levels Research System, review the methodology document, check the example report, and ensure all required skills are properly configured.*
