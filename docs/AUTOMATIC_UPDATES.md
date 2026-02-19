# Automatic Upstream Update System

This document explains daisetz's automatic upstream update detection and merging system.

## Overview

The automatic update system provides **hands-off synchronization** with the upstream daisetz repository. Instead of manually checking for updates, the system:

1. **Monitors** upstream repository daily
2. **Detects** new commits automatically
3. **Merges** changes via an agent job
4. **Creates** a PR with summary
5. **Notifies** you via Telegram
6. **Auto-merges** if safe (configurable)

This keeps your bot up-to-date with new features, bug fixes, and security patches while preserving your customizations.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Automatic Update Flow                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Cron Scheduler (Daily 2am)                                  │
│     └─> event_handler/cron/check-upstream-updates.sh           │
│                                                                  │
│  2. Check GitHub API                                            │
│     └─> GET api.github.com/repos/stephengpope/daisetz/...   │
│                                                                  │
│  3. Compare Commits                                             │
│     ├─> Read: event_handler/cron/.upstream-state.json          │
│     ├─> Latest upstream SHA                                     │
│     └─> If different → Updates available!                       │
│                                                                  │
│  4. Create Agent Job                                            │
│     └─> POST /webhook                                           │
│         Job: "Merge upstream updates..."                        │
│                                                                  │
│  5. Docker Agent Runs                                           │
│     └─> Read: operating_system/UPSTREAM_MERGE.md               │
│         ├─> git fetch upstream                                  │
│         ├─> git merge upstream/main                             │
│         ├─> Resolve conflicts (if any)                          │
│         ├─> Validate merge                                      │
│         └─> Commit changes                                      │
│                                                                  │
│  6. PR Created                                                  │
│     └─> gh pr create                                            │
│         Title: "Upstream merge: [summary]"                      │
│         Body: Detailed change summary                           │
│                                                                  │
│  7. Auto-Merge Workflow                                         │
│     ├─> Check: AUTO_MERGE setting                              │
│     ├─> Check: ALLOWED_PATHS                                   │
│     └─> If pass → Merge PR                                     │
│                                                                  │
│  8. Notification                                                │
│     └─> Telegram message                                        │
│         "✓ Upstream updates merged: [commits] changes"          │
│                                                                  │
│  9. Update State File                                           │
│     └─> Write: .upstream-state.json                            │
│         { last_commit: "new-sha", ... }                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Update Detection Script

**Location:** `event_handler/cron/check-upstream-updates.sh`

**Purpose:** Checks GitHub API for new commits and triggers agent jobs

**Features:**
- ✅ Fetches latest commit from upstream
- ✅ Compares with local tracking state
- ✅ Only triggers on actual updates (no duplicates)
- ✅ Stores state between checks
- ✅ Handles API errors gracefully
- ✅ Provides detailed logging

**Environment Variables:**
- `UPSTREAM_OWNER` - GitHub owner (default: `stephengpope`)
- `UPSTREAM_REPO` - Repository name (default: `daisetz`)
- `UPSTREAM_BRANCH` - Branch to track (default: `main`)
- `API_KEY` - Required to create agent jobs
- `PORT` - Event handler port (default: `3000`)

### 2. State Tracking File

**Location:** `event_handler/cron/.upstream-state.json`

**Purpose:** Tracks last processed commit to avoid duplicate notifications

**Format:**
```json
{
  "last_commit": "abc123def456789...",
  "last_check": "2026-02-19T02:00:00Z",
  "update_count": 5,
  "last_update_found": "2026-02-15T02:00:00Z"
}
```

**Fields:**
- **`last_commit`** - SHA of last commit we synced to
- **`last_check`** - ISO timestamp of most recent check
- **`update_count`** - Total updates detected since tracking began
- **`last_update_found`** - When we last found an update

### 3. Cron Job Configuration

**Location:** `operating_system/CRONS.json`

**Entry:**
```json
{
  "name": "upstream-update-check",
  "schedule": "0 2 * * *",
  "type": "command",
  "command": "bash check-upstream-updates.sh",
  "enabled": true
}
```

**Configuration:**
- **`schedule`** - When to run (default: 2am daily)
- **`enabled`** - Set to `false` to disable automatic checks

### 4. Merge Instructions

**Location:** `operating_system/UPSTREAM_MERGE.md`

**Purpose:** Provides step-by-step instructions for the agent to merge updates

**Process:**
1. Add upstream remote (if not exists)
2. Fetch upstream changes
3. Analyze what changed (commits, files, diff)
4. Perform merge with `git merge upstream/main`
5. Handle conflicts (prefer upstream for core, preserve custom)
6. Validate merge (check JSON, no merge markers)
7. Generate comprehensive PR summary
8. Commit and let entrypoint create PR

### 5. Management Skill

**Location:** `.pi/skills/upstream-updates/SKILL.md`

**Purpose:** Provides manual control over the update system

**Commands:**
- Check for updates now
- View update history
- Configure frequency
- Pause/resume automatic checks
- Reset state
- View pending changes

## Configuration

### Enable/Disable Automatic Updates

Edit `operating_system/CRONS.json` (or `custom/operating_system/CRONS.json`):

```json
{
  "name": "upstream-update-check",
  "enabled": true  // Set to false to disable
}
```

### Change Update Frequency

Edit the `schedule` field in CRONS.json:

| Schedule | Description |
|----------|-------------|
| `0 2 * * *` | Daily at 2am |
| `0 */12 * * *` | Every 12 hours |
| `0 0 * * 0` | Weekly (Sunday midnight) |
| `0 0 1 * *` | Monthly (1st of month) |
| `0 0 * * 1-5` | Weekdays only |

### Control Auto-Merge Behavior

Set GitHub repository variables:

**`AUTO_MERGE`** - Enable/disable automatic merging
- Set to `false` to require manual review
- Any other value or unset = auto-merge enabled

**`ALLOWED_PATHS`** - Restrict what can be auto-merged
- Comma-separated path prefixes: `/logs,/custom,/docs`
- Only merges if ALL changed files are within allowed paths
- Default: `/logs` (only auto-merge job logs)

**Example: Allow all upstream changes to auto-merge:**
```bash
# In GitHub repo settings → Variables
AUTO_MERGE=true
ALLOWED_PATHS=/
```

**Example: Require manual review:**
```bash
AUTO_MERGE=false
```

### Customize Upstream Source

To track a different upstream (e.g., your own fork):

Set environment variables in Event Handler:
```bash
UPSTREAM_OWNER=myusername
UPSTREAM_REPO=my-daisetz-fork
UPSTREAM_BRANCH=main
```

Or edit the script directly:
```bash
# In event_handler/cron/check-upstream-updates.sh
UPSTREAM_OWNER="myusername"
UPSTREAM_REPO="my-fork"
```

## Usage

### Manual Check

**Via Telegram:**
```
Check for upstream updates
```

**Via Command Line:**
```bash
cd event_handler/cron
bash check-upstream-updates.sh
```

**Via Webhook:**
```bash
curl -X POST http://your-server/webhook \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"job": "Check for upstream updates and merge if available"}'
```

### View Current State

```bash
cat event_handler/cron/.upstream-state.json | python3 -m json.tool
```

### View Pending Updates

```bash
cd /job
git fetch upstream main
LAST_COMMIT=$(grep -o '"last_commit":"[^"]*"' event_handler/cron/.upstream-state.json | cut -d'"' -f4)
git log --oneline $LAST_COMMIT..upstream/main
```

### Reset State (Force Next Check to Trigger)

```bash
echo '{"last_commit":"","last_check":"","update_count":0}' > event_handler/cron/.upstream-state.json
```

### Temporarily Disable

```bash
# Option 1: Edit CRONS.json
vim operating_system/CRONS.json
# Set enabled: false

# Option 2: Move script temporarily
mv event_handler/cron/check-upstream-updates.sh event_handler/cron/check-upstream-updates.sh.disabled
```

## Error Handling

### Network Issues

**Symptoms:** "GitHub API error: Could not resolve host"

**Handling:**
- Script exits with error code
- State file is not updated
- Next scheduled check will retry
- No agent job is triggered

**Resolution:** Transient network errors resolve automatically at next check

### API Rate Limiting

**Symptoms:** "GitHub API error: 403 rate limit exceeded"

**Handling:**
- Script exits with error
- State file unchanged
- Retry at next scheduled check

**Resolution:**
- Unauthenticated requests limited to 60/hour
- Authenticated requests get 5000/hour
- Add GitHub token for higher limits (not implemented by default)

### Merge Conflicts

**Symptoms:** Agent job creates PR but reports conflicts

**Handling:**
- Agent attempts automatic resolution (prefer upstream for core, keep custom)
- If resolution fails, PR is created anyway with conflict documentation
- `AUTO_MERGE` is bypassed (PR stays open for manual review)
- Telegram notification includes warning

**Resolution:**
1. Review PR on GitHub
2. Check conflicting files
3. Manually resolve conflicts
4. Merge PR

### Failed Agent Job

**Symptoms:** Update detected but no PR created

**Possible causes:**
- Agent Docker container failed to start
- Insufficient GitHub token permissions
- Repository access issues

**Resolution:**
1. Check GitHub Actions logs (run-job.yml)
2. Verify GH_TOKEN has write permissions
3. Check Docker image is accessible
4. Review agent session logs in `logs/<JOB_ID>/`

### State File Corruption

**Symptoms:** Check script fails to parse state file

**Handling:**
- Script logs error and recreates state file
- Treats as first check (establishes new baseline)

**Resolution:** Automatic - state file is reinitialized

### Duplicate Notifications

**Symptoms:** Multiple update jobs for same commits

**Prevention:**
- State file updated AFTER job creation succeeds
- If job creation fails, state unchanged, will retry
- Same commit SHA never triggers twice

**Resolution:** By design - retries are intentional when jobs fail

## Monitoring

### Check Last Update Time

```bash
cat event_handler/cron/.upstream-state.json | grep last_check
```

### View Update History Count

```bash
cat event_handler/cron/.upstream-state.json | grep update_count
```

### Monitor for Failures

Check Event Handler logs for errors:
```bash
# If using PM2
pm2 logs event-handler --lines 100

# If using systemd
journalctl -u daisetz-event-handler -n 100

# If running in foreground
# Errors appear in terminal output
```

### Verify Cron Is Running

```bash
# Event Handler logs show cron jobs at startup
# Look for:
# "upstream-update-check: 0 2 * * * (command)"
```

## Security Considerations

### API Access

- **GitHub API** - Unauthenticated (read-only, public repos)
- **Event Handler** - Requires `API_KEY` to create jobs
- **Agent Job** - Requires `GH_TOKEN` (from SECRETS) to create PR

### Data Exposure

- State file contains only commit SHAs and timestamps (no secrets)
- Check script runs in cron working directory (`event_handler/cron/`)
- Agent job runs in isolated Docker container

### Merge Safety

- `.gitattributes` protects `/custom/` files (merge=ours)
- Upstream core files automatically accepted (merge=theirs)
- Conflicts in edge cases handled manually via PR review
- `ALLOWED_PATHS` prevents unauthorized changes from auto-merging

### Supply Chain Security

**Risk:** Malicious upstream commit could be auto-merged

**Mitigations:**
1. **AUTO_MERGE=false** - Require manual review of all PRs
2. **ALLOWED_PATHS=/logs** - Only auto-merge safe paths
3. **PR review** - Always visible on GitHub before merge
4. **Telegram notification** - You're notified of every update
5. **Git history** - Full audit trail of what changed

**Best practice:** Review PRs before merging, especially for:
- Dockerfile changes
- entrypoint.sh modifications
- GitHub Actions workflow updates
- Event Handler code changes

## Testing

### Test Update Detection

```bash
# 1. Clear state to force detection
echo '{"last_commit":"","last_check":"","update_count":0}' > event_handler/cron/.upstream-state.json

# 2. Run check
cd event_handler/cron
bash check-upstream-updates.sh

# 3. Verify agent job was created
# Check GitHub Actions for new job/* branch
```

### Test Merge Process

```bash
# 1. Create test branch
git checkout -b test-upstream-merge

# 2. Fetch upstream
git fetch upstream main

# 3. Test merge (manual, not via agent)
git merge upstream/main

# 4. Check for conflicts
git status

# 5. If clean, delete test branch
git checkout main
git branch -D test-upstream-merge
```

### Test Auto-Merge Behavior

```bash
# 1. Set AUTO_MERGE=false in GitHub repo variables
# 2. Trigger an update
# 3. Verify PR is created but NOT auto-merged
# 4. Set AUTO_MERGE=true
# 5. Verify next update auto-merges
```

## Troubleshooting

### "No new updates" but I see commits on GitHub

**Causes:**
1. State file has latest commit already
2. Script running against wrong upstream
3. State file has future commit (after manual merge)

**Solutions:**
```bash
# Check state
cat event_handler/cron/.upstream-state.json

# Check actual upstream
git fetch upstream main
git log -1 upstream/main

# If mismatch, reset state
echo '{"last_commit":"","last_check":"","update_count":0}' > event_handler/cron/.upstream-state.json
```

### Script runs but no job created

**Causes:**
1. Event Handler not running
2. API_KEY not set
3. PORT mismatch

**Solutions:**
```bash
# Check Event Handler is running
curl http://localhost:3000/health

# Verify environment variables
echo $API_KEY
echo $PORT

# Check script output
cd event_handler/cron
bash check-upstream-updates.sh
```

### Jobs created but PRs not auto-merging

**Causes:**
1. `AUTO_MERGE=false`
2. Changes outside `ALLOWED_PATHS`
3. Merge conflicts present

**Solutions:**
```bash
# Check GitHub repo variables
# Settings → Secrets and variables → Actions → Variables
# AUTO_MERGE should be unset or not "false"
# ALLOWED_PATHS should include changed file paths

# Check PR for merge conflicts
# If conflicts, must merge manually
```

### Merge conflicts every time

**Causes:**
1. Customizations in wrong location (should be in `/custom/`)
2. `.gitattributes` merge strategies not working
3. Core files edited directly

**Solutions:**
```bash
# Validate setup
node setup/validate-setup.mjs

# Migrate to custom structure
node setup/migrate-to-custom.mjs

# Check merge attributes
cat .gitattributes
```

### State file keeps resetting

**Causes:**
1. File permissions issue
2. Competing processes writing to it
3. Disk full

**Solutions:**
```bash
# Check permissions
ls -la event_handler/cron/.upstream-state.json

# Ensure writable
chmod 644 event_handler/cron/.upstream-state.json

# Check disk space
df -h
```

## Best Practices

### 1. Review PRs Before Merging

Even with `AUTO_MERGE` enabled, always review the PR:
- Read the commit messages
- Check the diff for unexpected changes
- Verify tests pass (if you have CI tests)

### 2. Test After Updates

After an update merges:
```bash
# 1. Pull the changes
git pull

# 2. Restart Event Handler
pm2 restart event-handler

# 3. Test basic functionality
# - Send test Telegram message
# - Trigger test webhook
# - Verify crons are running
```

### 3. Keep Custom Files Separate

Always put customizations in `/custom/`:
- ✅ `custom/operating_system/SOUL.md`
- ✅ `custom/skills/my-skill/`
- ❌ `operating_system/SOUL.md` (direct edit)

### 4. Monitor Update Frequency

Check how often you're getting updates:
```bash
cat event_handler/cron/.upstream-state.json
# If update_count is high, consider less frequent checks
```

### 5. Backup Before Major Updates

If the PR shows major changes:
```bash
# Create backup branch before merging
git checkout -b backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)
```

### 6. Document Custom Changes

Keep notes in `custom/README.md`:
```markdown
# My Customizations

- Modified SOUL.md for finance domain
- Added custom skills: pdf-parser, email-sender
- Custom cron: daily-report at 9am
```

### 7. Use Semantic Versioning

If you fork daisetz, use tags to track versions:
```bash
git tag -a v1.0.0 -m "Stable version with my customizations"
git push origin v1.0.0
```

## Advanced: Custom Update Logic

### Add Pre-Merge Validation

Edit `operating_system/UPSTREAM_MERGE.md` to add checks:

```bash
# Before merging, run custom validation
if [ -f custom/validate-update.sh ]; then
  bash custom/validate-update.sh || exit 1
fi

# Then proceed with merge
git merge upstream/main
```

### Selective File Updates

To only update specific files:

```bash
# In UPSTREAM_MERGE.md, change merge strategy
git fetch upstream main

# Instead of full merge, cherry-pick files
git checkout upstream/main -- docs/
git checkout upstream/main -- .github/workflows/
git commit -m "Selective upstream update: docs + workflows"
```

### Custom Notification Format

Edit the check script to customize Telegram notifications:

```bash
# In check-upstream-updates.sh, modify job creation
curl -X POST "http://localhost:${PORT:-3000}/webhook" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${API_KEY}" \
  -d "{
    \"job\": \"Custom merge instructions here...\"
  }"
```

### Webhooks for Update Events

Add a trigger to notify external systems:

```json
// In operating_system/TRIGGERS.json
{
  "name": "upstream-update-notification",
  "watch_path": "/github/webhook",
  "actions": [
    {
      "type": "http",
      "url": "https://your-service.com/upstream-updated",
      "method": "POST",
      "vars": { "source": "daisetz-updates" }
    }
  ],
  "enabled": true
}
```

## FAQ

**Q: How much does this cost?**
A: Free! Uses unauthenticated GitHub API (no rate limit issues for daily checks) and regular agent jobs.

**Q: Can I track a private upstream?**
A: Yes, but you'll need to add GitHub token to the check script for API authentication.

**Q: What if I have extensive customizations?**
A: The custom/core separation prevents conflicts. Your `/custom/` files are never touched by upstream merges.

**Q: Can I disable for specific branches?**
A: The system only watches `main` by default. Change `UPSTREAM_BRANCH` to track a different branch.

**Q: How do I roll back a bad update?**
A: Revert the merge commit: `git revert -m 1 <merge-commit-sha>`

**Q: Can I get email notifications instead of Telegram?**
A: Yes, add an `http` type action to the update trigger that posts to your email service API.

**Q: What happens if upstream repository is deleted?**
A: Check script will fail gracefully, state file unchanged, retries at next scheduled time.

---

## Related Documentation

- [docs/UPSTREAM_UPDATES.md](./UPSTREAM_UPDATES.md) - Manual update procedures
- [operating_system/UPSTREAM_MERGE.md](/operating_system/UPSTREAM_MERGE.md) - Agent merge instructions
- [.pi/skills/upstream-updates/SKILL.md](../.pi/skills/upstream-updates/SKILL.md) - Management skill reference
- [docs/CUSTOM_CORE.md](./CUSTOM_CORE.md) - Custom/core architecture

---

**Quick Start:**

```bash
# Enable automatic updates
vim operating_system/CRONS.json
# Set "enabled": true for "upstream-update-check"

# Test it now
cd event_handler/cron
bash check-upstream-updates.sh

# Monitor state
watch -n 60 'cat .upstream-state.json | python3 -m json.tool'
```

That's it! Your bot now automatically stays up-to-date. 🚀
