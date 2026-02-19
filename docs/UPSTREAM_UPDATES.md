# Upstream Updates Guide

This guide explains how to manage updates from the daisetz template, including both **automatic update checking** and manual merge procedures.

## 🤖 Automatic Updates (Recommended)

daisetz includes an automatic upstream update checker that runs daily, detects new commits, and creates a PR with the changes. This is the easiest way to stay up-to-date!

### How It Works

1. **Scheduled check** runs daily (2am by default) via cron job
2. **Detection** compares upstream commits with your last sync
3. **Agent job** automatically merges updates when found
4. **PR created** with summary of changes
5. **Notification** sent via Telegram with details
6. **Auto-merge** (if enabled) merges the PR automatically

### Enable Automatic Updates

Automatic updates are controlled by the `upstream-update-check` cron job in `operating_system/CRONS.json`:

```json
{
  "name": "upstream-update-check",
  "schedule": "0 2 * * *",
  "type": "command",
  "command": "bash check-upstream-updates.sh",
  "enabled": true
}
```

**Set `"enabled": true`** to enable automatic checking.

### Configure Update Frequency

Edit the `schedule` field using cron syntax:

| Schedule | Frequency |
|----------|-----------|
| `0 2 * * *` | Daily at 2am (default) |
| `0 */12 * * *` | Every 12 hours |
| `0 0 * * 0` | Weekly on Sunday |
| `0 0 1 * *` | Monthly on 1st |

### Manual Check

Trigger an update check manually via Telegram:
```
Check for upstream updates
```

Or run the script directly:
```bash
cd event_handler/cron
bash check-upstream-updates.sh
```

### View Update Status

Check the state file to see when updates were last checked:
```bash
cat event_handler/cron/.upstream-state.json
```

Shows:
- `last_commit` - Last upstream commit we synced to
- `last_check` - When we last checked for updates
- `update_count` - Number of updates detected
- `last_update_found` - When the most recent update was found

### Disable Automatic Updates

To pause automatic checks, set `"enabled": false` in CRONS.json:

```json
{
  "name": "upstream-update-check",
  "enabled": false
}
```

## 📚 Architecture Overview

The daisetz repository uses a **custom/core separation** architecture:

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
git remote add upstream https://github.com/stephengpope/daisetz.git
git fetch upstream
```

### 2. Migrate Existing Customizations

If you have an older daisetz with customizations in `/operating_system/`:

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
# My daisetz Customizations

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

The custom/core separation was introduced in daisetz v2.0. If you're upgrading from v1.x:

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
