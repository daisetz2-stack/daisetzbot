# Skills Reorganization - February 2026

## Overview

The skills system has been reorganized to eliminate naming collisions and clarify architectural boundaries. Two different "5levels" capabilities have been separated and properly categorized.

## What Changed

### Before

```
operating_system/5levels/     # Research report generator (identity/config)
.pi/skills/5levels/           # Bilingual web content generator (capability)
```

**Problem:** 
- Naming collision between two different systems
- Confusion about which system does what
- Research system in wrong architectural layer (operating_system vs skills)

### After

```
.pi/skills/5levels-explainer/    # Research report generator
.pi/skills/academic-research/    # Bilingual web content generator
```

**Resolution:**
- Clear separation of concerns
- Both properly located as reusable capabilities
- No name collisions
- Accurate naming that reflects functionality

## The Two Skills

### 1. 5levels-explainer

**Location:** `.pi/skills/5levels-explainer/`

**Purpose:** Generate comprehensive research reports with progressive depth

**Framework:**
- Level 1: Foundation & Overview (ELI5)
- Level 2: Core Concepts & Components
- Level 3: Deep Dive & Technical Details
- Level 4: Applications, Implications & Impact
- Level 5: Advanced Perspectives & Future Directions

**Output:** 
- Markdown research reports (8,000-15,000 words)
- Saved to: `logs/[JOB_ID]/5levels_report.md`
- 30-50 citations from diverse sources

**Duration:** 60-90 minutes

**Use Cases:**
- Deep research analysis
- Comprehensive topic exploration
- Academic-style reports
- Single-language content (English)

**Key Files:**
- `SKILL.md` - Main skill documentation
- `5levels_research.md` - Research methodology
- `5levels_report_template.md` - Report structure
- `5levels_report.md` - Example report (Neural Networks)
- `ARCHITECTURE.md` - System architecture
- `INTEGRATION_GUIDE.md` - Integration patterns

**How to Use:**
```
Read the file at .pi/skills/5levels-explainer/5levels_research.md and conduct comprehensive 5-level research on: [keyword]
```

### 2. academic-research

**Location:** `.pi/skills/academic-research/`

**Purpose:** Generate bilingual educational content for web publishing

**Framework:**
- Level 1: Child (Age 5-10)
- Level 2: Teen (Age 13-17)
- Level 3: Undergraduate Student
- Level 4: Graduate Student
- Level 5: Expert

**Output:**
- JSON files with bilingual content
- Saved to: `website/data/topics/[slug].json`
- Culturally adapted (not just translated)

**Duration:** 40-55 minutes

**Use Cases:**
- Educational website content
- Bilingual explanations (English + Japanese)
- Cross-cultural knowledge sharing
- Progressive learning materials

**Key Files:**
- `SKILL.md` - Complete documentation and guidelines

**How to Use:**
```
Read the file at .pi/skills/academic-research/SKILL.md and follow its instructions to create a bilingual 5-level explanation for: [keyword]
```

## Integration Points

### Telegram Chat (`/5levels` command)

The `/5levels` command uses **academic-research** for bilingual web content:

**CHATBOT.md configuration:**
```markdown
Read the file at /job/.pi/skills/academic-research/SKILL.md and follow its instructions to create a bilingual 5-level explanation for: [keyword]
```

### Webhook Triggers

For comprehensive research reports, use **5levels-explainer**:

```json
{
  "name": "deep-research",
  "watch_path": "/webhook",
  "actions": [{
    "type": "agent",
    "job": "Read .pi/skills/5levels-explainer/5levels_research.md and research: {{body.keyword}}"
  }]
}
```

### Scheduled Research

Both skills can be used in cron jobs:

**For research reports:**
```json
{
  "name": "weekly-research",
  "schedule": "0 0 * * 1",
  "type": "agent",
  "job": "Read .pi/skills/5levels-explainer/5levels_research.md and research: artificial intelligence",
  "enabled": true
}
```

**For bilingual content:**
```json
{
  "name": "weekly-explainer",
  "schedule": "0 0 * * 1",
  "type": "agent",
  "job": "Read .pi/skills/academic-research/SKILL.md and create bilingual content for: machine learning",
  "enabled": true
}
```

## Files Updated

### Configuration Files
- `operating_system/CHATBOT.md` - Updated skill reference
- `website/scripts/verify-system.js` - Updated path check

### Documentation Files
- `docs/5LEVELS.md` - Updated skill references
- `docs/5LEVELS_TESTING.md` - Updated path check
- `website/README.md` - Updated skill reference

### Skill Internal References
All files within `.pi/skills/5levels-explainer/` updated to reference new location

## Potential Integration

While currently separate, these skills could work together:

**Validated Frontier Explanations:**
```
1. Use academic-research to create bilingual Level 1-4 content
2. Use 5levels-explainer to generate deep Level 5 research
3. Validate Level 5 against comprehensive research findings
4. Merge into single bilingual output with validated frontier section
```

**Comparative Analysis:**
```
1. Run 5levels-explainer for comprehensive English research
2. Run academic-research for culturally-adapted Japanese perspective
3. Compare findings across cultures
4. Identify universal vs. culture-specific insights
```

## Migration Notes

### No Breaking Changes

- The `/5levels` command continues to work unchanged
- Old file paths in logs remain valid (historical reference)
- All functionality preserved, just better organized

### For Developers

If you have custom integrations referencing the old paths:

1. Replace `operating_system/5levels/` → `.pi/skills/5levels-explainer/`
2. Replace `.pi/skills/5levels/` → `.pi/skills/academic-research/`
3. Update job descriptions to reference new paths

### Verification

Run the verification script:
```bash
node website/scripts/verify-system.js
```

This checks that:
- Skills are in correct locations
- CHATBOT.md references are updated
- Website integration is intact

## Summary

| Aspect | 5levels-explainer | academic-research |
|--------|-------------------|-------------------|
| **Output** | Research report (MD) | Web content (JSON) |
| **Languages** | English | English + Japanese |
| **Depth** | Comprehensive (8-15k words) | Progressive (5 levels) |
| **Duration** | 60-90 min | 40-55 min |
| **Citations** | 30-50 sources | 2-3 per level |
| **Use Case** | Deep analysis | Educational content |
| **Location** | logs/[JOB_ID]/ | website/data/topics/ |

## Questions?

- See individual `SKILL.md` files for detailed usage
- Check `5levels-explainer/INTEGRATION_GUIDE.md` for advanced patterns
- Review `docs/5LEVELS.md` for web system documentation

---

**Date:** February 18, 2026  
**Status:** Complete  
**Breaking Changes:** None  
**Action Required:** None (automatic migration complete)
