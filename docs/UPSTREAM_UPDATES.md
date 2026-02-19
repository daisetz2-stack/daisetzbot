# Upstream Updates Guide

This guide explains how to pull updates from the thepopebot template while preserving your customizations.

## Overview

The thepopebot repository uses a **custom/core separation** architecture:

- **Core files** (in root directories) - Get updated from upstream
- **Custom files** (in `/custom/`) - Your customizations, protected from conflicts
- **Automatic fallback** - System checks `/custom/` first, then falls back to defaults

This means you can safely run `git merge upstream/main` to get new features without losing your customizations!

## Directory Structure

```
/
├── custom/                      # Your customizations (protected)
│   ├── operating_system/       # Your bot config
│   │   ├── SOUL.md             # Your personality
│   │   ├── CRONS.json          # Your cron jobs
│   │   └── ...                 # Your other configs
│   └── skills/                 # Your custom skills
│
├── operating_system/            # Default configs (updated from upstream)
│   ├── SOUL.md                 # Example personality
│   ├── CRONS.json              # Example crons
│   └── ...
│
├── .pi/skills/                 # Example skills (updated from upstream)
├── event_handler/              # Core code (updated from upstream)
├── .github/workflows/          # CI/CD (updated from upstream)
├── Dockerfile                  # Core (updated from upstream)
└── entrypoint.sh               # Core (updated from upstream)
```

## Initial Setup (One-Time)

### 1. Add Upstream Remote

If you cloned from your own fork:

```bash
git remote add upstream https://github.com/stephengpope/thepopebot.git
git fetch upstream
```

### 2. Migrate Existing Customizations

If you have an older thepopebot with customizations in `/operating_system/`:

```bash
node setup/migrate-to-custom.mjs
```

This will:
- Copy your customizations to `/custom/operating_system/`
- Copy your custom skills to `/custom/skills/`
- Leave defaults in place for fallback

### 3. Verify Setup

```bash
node setup/validate-setup.mjs
```

This checks that all files are in the correct locations.

## Pulling Upstream Updates

### Standard Update Workflow

```bash
# 1. Fetch latest changes from upstream
git fetch upstream

# 2. Merge upstream changes
git merge upstream/main

# 3. If there are no conflicts, you're done!
git push origin main
```

### What Gets Updated

When you merge from upstream, these files are **automatically updated**:

✅ **Core Infrastructure**
- `.github/workflows/*.yml` - CI/CD improvements
- `event_handler/` - New features, bug fixes
- `Dockerfile` - Runtime environment updates
- `entrypoint.sh` - Startup script improvements
- `.pi/extensions/` - Security and core extensions

✅ **Tools & Setup**
- `setup/` - Setup wizard improvements
- `docs/` - Documentation updates

✅ **Examples**
- `operating_system/*.md` - Updated example configs
- `.pi/skills/` - New example skills

### What Stays Protected

Your customizations in `/custom/` are **automatically protected**:

🛡️ **Your Custom Files** (Never overwritten)
- `custom/operating_system/SOUL.md` - Your personality
- `custom/operating_system/CRONS.json` - Your cron jobs
- `custom/operating_system/TRIGGERS.json` - Your triggers
- `custom/skills/` - Your custom skills
- `logs/` - Your job logs and data

### How It Works

The `.gitattributes` file defines merge strategies:

```
# Your customizations always win
custom/** merge=ours

# Upstream core code wins
.github/** merge=theirs
event_handler/** merge=theirs
Dockerfile merge=theirs
entrypoint.sh merge=theirs

# Documentation merges both versions
docs/** merge=union
```

## Handling Conflicts

### Rare Conflicts

Conflicts are rare because of the merge strategies, but they can happen in:
- `README.md` - Both you and upstream edited it
- `package.json` - Both added dependencies
- `.gitignore` - Both added patterns

### Resolving Conflicts

If you get a conflict:

```bash
# 1. Check which files have conflicts
git status

# 2. Edit conflicting files manually
# Look for <<<<<<< HEAD markers

# 3. After fixing, stage and commit
git add .
git commit -m "Merge upstream with custom changes"
git push origin main
```

### Conflict Prevention

To minimize conflicts:
- Don't edit core files directly (use `/custom/` overrides instead)
- Keep your README customizations minimal
- Document your changes in `/custom/README.md` instead of root README

## Testing After Updates

After merging upstream changes:

```bash
# 1. Validate setup
node setup/validate-setup.mjs

# 2. Test Event Handler locally
cd event_handler
npm install  # Get any new dependencies
npm start

# 3. Test a simple job
# Create a test job through Telegram or webhook

# 4. Check logs for errors
tail -f event_handler/logs/*.log  # If you have file logging enabled
```

## Advanced: Selective Updates

### Update Only Documentation

```bash
git fetch upstream
git checkout upstream/main -- docs/
git commit -m "Update documentation from upstream"
```

### Update Only Workflows

```bash
git fetch upstream
git checkout upstream/main -- .github/workflows/
git commit -m "Update GitHub Actions workflows"
```

### Cherry-Pick Specific Commits

```bash
git fetch upstream
git log upstream/main  # Find commit hash
git cherry-pick <commit-hash>
```

## Troubleshooting

### "I accidentally modified a core file"

If you edited a core file directly and now have conflicts:

```bash
# Restore core file from upstream
git checkout upstream/main -- path/to/file

# Move your changes to custom override if needed
# Example: Create custom/operating_system/SOUL.md instead of editing operating_system/SOUL.md
```

### "My custom config isn't being used"

Check the loading order:

```bash
# Verify your custom file exists
ls -la custom/operating_system/

# Check what the system is loading
# Event Handler logs show "(custom)" or "(default)" on startup

# Validate setup
node setup/validate-setup.mjs
```

### "I want to reset to default config"

To stop using a custom override and use the default:

```bash
# Remove your custom version
rm custom/operating_system/SOUL.md

# System will now fall back to operating_system/SOUL.md
```

### "New upstream skill conflicts with my custom skill"

If upstream adds a skill with the same name as yours:

```bash
# Option 1: Rename your custom skill
mv custom/skills/my-skill custom/skills/my-custom-skill

# Option 2: Keep yours (it takes precedence anyway)
# Custom skills override core skills with the same name
```

## Best Practices

### 1. Always Use `/custom/` for Customizations

✅ **Good:**
```bash
cp operating_system/SOUL.md custom/operating_system/SOUL.md
# Edit custom/operating_system/SOUL.md
```

❌ **Bad:**
```bash
# Edit operating_system/SOUL.md directly
```

### 2. Review Changes Before Merging

```bash
# See what changed in upstream
git fetch upstream
git log HEAD..upstream/main --oneline

# See detailed changes
git diff HEAD..upstream/main
```

### 3. Test in a Branch First

```bash
# Create test branch
git checkout -b test-upstream-merge

# Merge and test
git merge upstream/main
# Run tests...

# If good, merge to main
git checkout main
git merge test-upstream-merge
```

### 4. Keep a Clean Commit History

```bash
# Use meaningful commit messages
git commit -m "Merge upstream: Add new academic-research improvements"

# Not just "merge"
```

### 5. Document Your Customizations

Keep notes in `custom/README.md`:

```markdown
# My thepopebot Customizations

- Custom SOUL.md: Added financial advisor personality
- Custom skills: pdf-processor, email-handler
- Modified CRONS.json: Added daily report at 9am
```

## Getting Help

If you run into issues with upstream updates:

1. **Check validation**: `node setup/validate-setup.mjs`
2. **Review merge strategies**: `cat .gitattributes`
3. **Check git config**: `git config --list | grep merge`
4. **Ask for help**: Open an issue on GitHub with:
   - Your merge command
   - Conflict details (`git status`)
   - Your customizations

## Version Compatibility

The custom/core separation was introduced in thepopebot v2.0. If you're upgrading from v1.x:

```bash
# 1. Fetch latest
git fetch upstream

# 2. Migrate first (before merging)
node setup/migrate-to-custom.mjs

# 3. Then merge
git merge upstream/main
```

## Summary

**Update Command:**
```bash
git fetch upstream && git merge upstream/main
```

**What Happens:**
- ✅ Core code updated automatically
- ✅ Your customizations stay untouched
- ✅ New features available immediately
- ✅ Minimal conflicts

**Key Files:**
- `.gitattributes` - Defines merge strategies
- `custom/` - Your protected customizations
- `setup/migrate-to-custom.mjs` - Migration tool
- `setup/validate-setup.mjs` - Validation tool

---

**Ready to update?** Just run:
```bash
git fetch upstream && git merge upstream/main
```

That's it! 🎉
