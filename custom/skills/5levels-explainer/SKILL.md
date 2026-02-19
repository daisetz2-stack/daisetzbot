---
name: 5levels-explainer
description: Generate progressive 5-level explanations from elementary (ELI5) to frontier research. Use when user requests "/5levels [keyword]" command or asks for multi-level educational content with bilingual support (English/Japanese).
---

# 5 Levels Explainer Skill

Creates comprehensive, progressive explanations of topics across five levels of complexity:

## The 5 Levels Framework

1. **Level 1: Foundation & Overview (ELI5)** - Simple definitions accessible to anyone
2. **Level 2: Core Concepts & Components** - Breaking down into essential parts
3. **Level 3: Deep Dive & Technical Details** - Detailed mechanisms and processes
4. **Level 4: Applications, Implications & Impact** - Real-world applications and use cases
5. **Level 5: Advanced Perspectives & Future Directions** - Latest developments and frontier research

## Usage

When triggered with `/5levels [keyword]`, the agent:
1. Conducts progressive research from foundational understanding to cutting-edge developments
2. Produces a detailed, well-sourced report
3. Saves output to `logs/[JOB_ID]/5levels_report.md`

## Core Files

- **5levels_research.md** - Research methodology and process definition
- **5levels_report_template.md** - Report structure and formatting standards
- **5levels_report.md** - Example report (Neural Networks)

## Integration

### Via Telegram Chat
```
/5levels quantum computing
```
Creates job: "Read the file at .pi/skills/5levels-explainer/5levels_research.md and conduct comprehensive 5-level research on: quantum computing"

### Via Webhook Trigger
```json
{
  "name": "5levels-command",
  "watch_path": "/webhook",
  "actions": [{
    "type": "agent",
    "job": "Read .pi/skills/5levels-explainer/5levels_research.md and research: {{body.keyword}}"
  }]
}
```

## Requirements

- **brave-search skill** - For web research at each level (requires `BRAVE_API_KEY` in `LLM_SECRETS`)
- **Duration:** ~60-90 minutes per keyword
- **Output:** 8,000-15,000 word report with 30-50 citations

## Bilingual Support

The system supports creating content for both English and Japanese audiences, with culturally-adapted examples and metaphors.

## Output Location

Reports are saved to:
```
logs/[JOB_ID]/5levels_report.md
```

## See Also

- **academic-research** skill - For deep literature analysis with evidence extraction (different from this progressive explainer)
- Full documentation in README.md and ARCHITECTURE.md
