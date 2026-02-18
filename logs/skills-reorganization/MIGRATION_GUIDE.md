# Migration Guide: Skills Reorganization

## Overview

The 5levels explainer and academic research systems have been reorganized into separate, clearly-defined skills. This guide helps you update any external references or custom code.

## Path Changes

### Old Paths → New Paths

| Old Path | New Path | Purpose |
|----------|----------|---------|
| `operating_system/5levels/` | `.pi/skills/5levels-explainer/` | Progressive educational explanations |
| `.pi/skills/5levels/` | `.pi/skills/academic-research/` | Evidence-based literature analysis |

## What You Need to Update

### 1. Job Descriptions

**Old:**
```
Read the file at operating_system/5levels/5levels_research.md and research: quantum computing
```

**New:**
```
Read the file at .pi/skills/5levels-explainer/5levels_research.md and research: quantum computing
```

---

**Old:**
```
Read the file at /job/.pi/skills/5levels/SKILL.md and generate a research map
```

**New:**
```
Read the file at /job/.pi/skills/academic-research/SKILL.md and generate a research map
```

### 2. Telegram Bot Commands

**Old:**
```
/5levels quantum computing
```

**New:**
```
/5levels quantum computing
```
✅ **No change needed** - The `/5levels` command still works. The CHATBOT.md has been updated automatically.

### 3. Webhook Triggers (TRIGGERS.json)

If you have custom triggers that reference the old paths:

**Old:**
```json
{
  "name": "5levels-trigger",
  "actions": [{
    "job": "Read operating_system/5levels/5levels_research.md and research: {{body.keyword}}"
  }]
}
```

**New:**
```json
{
  "name": "5levels-trigger",
  "actions": [{
    "job": "Read .pi/skills/5levels-explainer/5levels_research.md and research: {{body.keyword}}"
  }]
}
```

### 4. Cron Jobs (CRONS.json)

If you have scheduled 5levels research jobs:

**Old:**
```json
{
  "name": "weekly-research",
  "job": "Read operating_system/5levels/5levels_research.md and research the trending topic"
}
```

**New:**
```json
{
  "name": "weekly-research",
  "job": "Read .pi/skills/5levels-explainer/5levels_research.md and research the trending topic"
}
```

### 5. Command-Line Scripts

If you have scripts that invoke the research pipeline:

**Old:**
```bash
cd /job/.pi/skills/5levels
./research-pipeline.mjs "quantum computing"
```

**New:**
```bash
cd /job/.pi/skills/academic-research
./research-pipeline.mjs "quantum computing"
```

### 6. Programmatic Imports (Node.js)

**Old:**
```javascript
import { runResearch } from '.pi/skills/5levels/research-pipeline.mjs';
```

**New:**
```javascript
import { runResearch } from '.pi/skills/academic-research/research-pipeline.mjs';
```

## Skill Name Changes

### SKILL.md Metadata

**Old:**
```yaml
---
name: 5levels
description: Research and generate bilingual 5-level explanations...
---
```

**New (5levels-explainer):**
```yaml
---
name: 5levels-explainer
description: Generate progressive 5-level explanations from elementary (ELI5) to frontier research...
---
```

**New (academic-research):**
```yaml
---
name: academic-research
description: Deep literature analysis with evidence extraction, claim grouping, tension detection...
---
```

## What Doesn't Need Updating

✅ **Telegram `/5levels` command** - Still works, automatically routes to new location  
✅ **Existing job logs** - Historical records in `logs/` directories are preserved  
✅ **Core functionality** - Both systems work exactly as before  
✅ **Dependencies** - brave-search, OpenAlex, CORE APIs all unchanged

## Breaking Changes

### None! 🎉

This reorganization was designed to be **non-breaking**:
- The `/5levels` command still works
- All functionality preserved
- No API changes
- No config format changes

The only updates needed are for **custom code or documentation** that directly references the old paths.

## Quick Find & Replace

If you have external documentation or code:

```bash
# Find all references to old paths
grep -r "operating_system/5levels" /your/docs/
grep -r "\.pi/skills/5levels" /your/code/ --include="*.js" --include="*.md"

# Replace in files (use carefully!)
find /your/docs -type f -name "*.md" -exec sed -i 's|operating_system/5levels|.pi/skills/5levels-explainer|g' {} +
find /your/code -type f -name "*.js" -exec sed -i 's|\.pi/skills/5levels/|.pi/skills/academic-research/|g' {} +
```

## Decision Tree: Which Skill to Reference?

```
What are you trying to do?

├─ Create progressive educational content?
│  └─ Use: .pi/skills/5levels-explainer/
│
├─ Extract evidence from academic papers?
│  └─ Use: .pi/skills/academic-research/
│
├─ Generate bilingual explanations?
│  └─ Use: .pi/skills/5levels-explainer/
│
└─ Analyze research literature for gaps/tensions?
   └─ Use: .pi/skills/academic-research/
```

## Testing Your Updates

After updating your references:

### Test 5levels-explainer
```bash
# Create a test job
echo "Read .pi/skills/5levels-explainer/SKILL.md and create a brief explanation of: photosynthesis" | \
  curl -X POST https://your-bot-url.com/webhook \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"job": "Read .pi/skills/5levels-explainer/SKILL.md and explain: photosynthesis"}'
```

### Test academic-research
```bash
cd .pi/skills/academic-research
./research-pipeline.mjs "photosynthesis" --papers=5 --tokens=200
```

## Common Questions

**Q: Can I still use `/5levels` in Telegram?**  
A: Yes! It works exactly as before.

**Q: Do I need to update my TRIGGERS.json or CRONS.json?**  
A: Only if you have custom triggers/crons that explicitly reference the old paths.

**Q: What if I have old job descriptions saved?**  
A: Update them to use the new paths. Old logs are preserved as historical records.

**Q: Can both skills work together?**  
A: Yes! You can use academic-research to generate evidence-based research maps, then feed those into 5levels-explainer for educational content.

**Q: Are there any performance differences?**  
A: No, both systems perform identically to their previous versions.

## Need Help?

If you encounter issues after the migration:

1. **Check paths** - Ensure you're using the new locations
2. **Review SKILL.md** - Each skill has updated documentation
3. **Check logs** - Look for "file not found" errors indicating old paths
4. **Test incrementally** - Update one reference at a time and test

## Rollback (If Needed)

If you absolutely need to rollback to the old structure (not recommended):

```bash
# This is destructive - only use if absolutely necessary!
git checkout main -- operating_system/5levels
git checkout main -- .pi/skills/5levels
# Then manually merge any custom changes
```

However, the new structure is **strongly recommended** as it:
- Prevents naming conflicts
- Provides clearer separation of concerns
- Enables better skill discovery
- Allows independent evolution of systems

---

**Last Updated:** 2026-02-18  
**Reorganization Version:** 2.0  
**Status:** Complete and tested
