# Quick Reference - Upstream Updates

## TL;DR

```bash
# Add upstream (one-time)
git remote add upstream https://github.com/stephengpope/thepopebot.git

# Get updates (anytime)
git fetch upstream && git merge upstream/main
```

Your customizations in `/custom/` are automatically protected. Core code gets updated automatically.

---

## File Locations

### To Customize Configuration

❌ **Old way:** Edit `operating_system/SOUL.md`  
✅ **New way:** Copy to `custom/operating_system/SOUL.md` then edit

### To Add Custom Skill

❌ **Old way:** Add to `.pi/skills/my-skill/`  
✅ **New way:** Add to `custom/skills/my-skill/`

---

## Quick Commands

### Setup

```bash
# New user
npm run setup

# Existing user (migrate)
npm run migrate
```

### Validate

```bash
npm run validate
```

### Update from Upstream

```bash
git fetch upstream
git merge upstream/main
```

---

## What Gets Updated

| Path | Updated from Upstream? | Your Customizations Safe? |
|------|----------------------|--------------------------|
| `custom/**` | ❌ Never | ✅ Yes (protected) |
| `operating_system/**` | ✅ Yes (examples) | ✅ Yes (in `/custom/`) |
| `.pi/skills/**` | ✅ Yes (examples) | ✅ Yes (in `/custom/`) |
| `event_handler/**` | ✅ Yes (core code) | N/A |
| `.github/workflows/**` | ✅ Yes (CI/CD) | N/A |
| `logs/**` | ❌ Never | ✅ Yes (your data) |

---

## File Resolution

System checks in this order:

1. `/custom/operating_system/SOUL.md` (your version)
2. `/operating_system/SOUL.md` (default fallback)

Same for: CHATBOT.md, AGENT.md, CRONS.json, TRIGGERS.json, etc.

---

## Examples

### Customize Bot Personality

```bash
# Copy default to custom
cp operating_system/SOUL.md custom/operating_system/SOUL.md

# Edit your copy
nano custom/operating_system/SOUL.md

# Your version will be used
```

### Add Custom Cron Job

```bash
# Copy default if you don't have custom yet
cp operating_system/CRONS.json custom/operating_system/CRONS.json

# Edit to add your job
nano custom/operating_system/CRONS.json

# Your crons will be used
```

### Add Custom Skill

```bash
# Create skill directory
mkdir -p custom/skills/my-skill

# Add skill files
echo "# My Custom Skill" > custom/skills/my-skill/SKILL.md

# Skill will be auto-discovered
```

### Reset to Default

```bash
# Stop using custom version
rm custom/operating_system/SOUL.md

# System will use default
```

---

## Troubleshooting

### "Which config is being used?"

```bash
# Run validation to see
npm run validate

# Output shows (custom) or (default):
# ✓ SOUL.md (custom)
# ✓ CHATBOT.md (default)
```

### "Update caused conflicts"

Rare, but if it happens:

```bash
# See conflicts
git status

# Edit files with <<<<<<< markers
# Then commit
git add .
git commit -m "Resolved merge conflicts"
```

### "I edited a core file by mistake"

```bash
# Reset core file
git checkout upstream/main -- operating_system/SOUL.md

# Move your changes to custom
cp operating_system/SOUL.md custom/operating_system/SOUL.md
# Edit custom version
```

---

## Best Practices

✅ **DO:**
- Customize in `/custom/operating_system/`
- Add custom skills to `/custom/skills/`
- Run `npm run validate` after changes
- Review upstream changes before merging

❌ **DON'T:**
- Edit `/operating_system/` files directly
- Edit `/event_handler/` files (unless contributing)
- Delete `/custom/` directory
- Ignore merge conflicts

---

## Directory Structure

```
/
├── custom/                    # Your customizations (YOU EDIT THESE)
│   ├── operating_system/
│   │   ├── SOUL.md           # Your personality
│   │   ├── CRONS.json        # Your cron jobs
│   │   └── ...
│   └── skills/
│       └── my-skill/         # Your skills
│
├── operating_system/          # Defaults (LEAVE THESE ALONE)
│   ├── SOUL.md               # Example personality
│   ├── CRONS.json            # Example crons
│   └── ...
│
├── .pi/skills/               # Core skills (LEAVE THESE ALONE)
├── event_handler/            # Core code (LEAVE THESE ALONE)
└── .github/workflows/        # CI/CD (LEAVE THESE ALONE)
```

---

## Help

- **Setup Issues:** `npm run validate`
- **Merge Conflicts:** [docs/UPSTREAM_UPDATES.md](/docs/UPSTREAM_UPDATES.md#handling-conflicts)
- **Migration:** `npm run migrate`
- **Full Guide:** [docs/UPSTREAM_UPDATES.md](/docs/UPSTREAM_UPDATES.md)
