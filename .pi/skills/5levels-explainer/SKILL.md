---
name: 5levels-explainer
description: Generate comprehensive 5-level research reports on any topic, progressing from foundational understanding to cutting-edge developments. Use when user requests "/5levels [keyword]" or needs deep research analysis.
---

# 5 Levels Research Report Generator

Generate comprehensive, progressive research reports that build from foundational knowledge to expert-level insights.

## Overview

This skill creates detailed research reports using a 5-level methodology that progressively deepens understanding:
- **Level 1**: Foundation & Overview (ELI5)
- **Level 2**: Core Concepts & Components  
- **Level 3**: Deep Dive & Technical Details
- **Level 4**: Applications, Implications & Impact
- **Level 5**: Advanced Perspectives & Future Directions

Reports are thoroughly researched, well-sourced (30-50 citations), and comprehensive (8,000-15,000 words).

## Usage

When the user sends `/5levels [keyword]`, conduct progressive research following the methodology in `5levels_research.md`:

1. **Read the methodology**: `cat .pi/skills/5levels-explainer/5levels_research.md`
2. **Use Brave Search** to gather sources at each level
3. **Follow the template**: `5levels_report_template.md` for report structure
4. **Save output**: Write final report to `logs/[JOB_ID]/5levels_report.md`
5. **Commit the report**: Ensure it's preserved in the repository

## Expected Duration

- Level 1: 5-10 minutes (foundational search)
- Level 2: 10-15 minutes (core concept mapping)
- Level 3: 15-20 minutes (technical deep dive)
- Level 4: 15-20 minutes (application research)
- Level 5: 10-15 minutes (frontier exploration)
- Report generation: 10-15 minutes (synthesis and formatting)

**Total: 60-90 minutes per keyword**

## Core Files

| File | Purpose |
|------|---------|
| `5levels_research.md` | Complete research methodology and process |
| `5levels_report_template.md` | Report structure and formatting guidelines |
| `5levels_report.md` | Example report (Neural Networks) |
| `ARCHITECTURE.md` | System architecture documentation |
| `INTEGRATION_GUIDE.md` | Integration with thepopebot systems |
| `JOB_SUMMARY.md` | Job completion summary template |

## Research Process

For each level:

1. **Define research objectives** (from methodology)
2. **Execute web searches** using brave-search skill
3. **Extract and synthesize** key information
4. **Document sources** with proper citations
5. **Build progressively** on previous levels

## Quality Standards

- 30-50 citations from diverse sources
- Each level builds on previous findings
- Multiple independent sources per major claim
- Include both foundational and recent research
- Highlight unsolved problems and expert debates
- Cross-verify facts across sources

## Output Format

Reports are saved as Markdown:

```
logs/[JOB_ID]/5levels_report.md
```

Follow the structure in `5levels_report_template.md`:
- Title and metadata
- Executive summary
- 5 levels of progressive explanation
- Comprehensive source list
- Key takeaways

## Integration

This skill integrates with:
- **brave-search**: For web research at each level (requires `BRAVE_API_KEY`)
- **Telegram**: For command triggers and notifications
- **Git**: For committing completed reports

## Example Topics

- Technical: "neural networks", "quantum computing", "blockchain"
- Scientific: "CRISPR gene editing", "dark matter", "climate change"
- Business: "decentralized autonomous organizations", "supply chain"
- Historical: "Renaissance", "Industrial Revolution"

## Tips

- Be specific with keywords ("quantum error correction" vs "quantum")
- Use Brave Search's `--content` flag for full article text
- Search for recent developments (use `--freshness pm` for past month)
- Include academic, news, and community sources
- Document sources during research, not after
- Check example report for quality reference

## Customization

To modify research depth or format:
- Edit `5levels_research.md` for methodology changes
- Edit `5levels_report_template.md` for format changes
- Create domain-specific variants (scientific, business, technical)

See `ARCHITECTURE.md` and `INTEGRATION_GUIDE.md` for full documentation.
