# Upstream Updates Management Skill

This skill provides commands and tools for managing automatic upstream updates for thepopebot.

## When to Use This Skill

Use this skill when the user requests:
- "Check for upstream updates"
- "Show update history"
- "Configure update frequency"
- "Pause/resume automatic updates"
- "Show last update check"
- "Force check for updates now"

## Available Commands

### 1. Manual Update Check

Run the upstream check script manually:

```bash
cd event_handler/cron
bash check-upstream-updates.sh
```

This will:
- Check for new commits on upstream
- Trigger an agent job if updates are found
- Update the state file with latest check time

### 2. View Update State

Check the current state of upstream tracking:

```bash
cat event_handler/cron/.upstream-state.json | python3 -m json.tool
```

This shows:
- `last_commit` - Last commit hash we synced to
- `last_check` - Timestamp of last check
- `update_count` - Number of times updates were found
- `last_update_found` - When the most recent update was detected

### 3. View Update History

Get a summary of commits between current state and upstream:

```bash
# First, ensure upstream remote exists
cd /job
git remote add upstream https://github.com/stephengpope/thepopebot.git 2>/dev/null || true
git fetch upstream main

# Get current commit from state file
LAST_COMMIT=$(grep -o '"last_commit":"[^"]*"' event_handler/cron/.upstream-state.json | cut -d'"' -f4)

if [ -n "$LAST_COMMIT" ]; then
  echo "Commits since last update ($LAST_COMMIT):"
  git log --oneline --no-merges $LAST_COMMIT..upstream/main
  
  echo -e "\nFiles changed:"
  git diff --stat $LAST_COMMIT..upstream/main
else
  echo "No previous sync recorded. Showing latest upstream commits:"
  git log --oneline --no-merges upstream/main -n 10
fi
```

### 4. Configure Update Frequency

The update check frequency is controlled by the cron schedule in CRONS.json. To modify:

```bash
# Read current schedule
CURRENT_SCHEDULE=$(grep -A 1 '"name": "upstream-update-check"' operating_system/CRONS.json | grep schedule | cut -d'"' -f4)
echo "Current schedule: $CURRENT_SCHEDULE"

# To change, update CRONS.json
# Example schedules:
# "0 0 * * *"      - Daily at midnight
# "0 */12 * * *"   - Every 12 hours
# "0 0 * * 0"      - Weekly on Sunday
# "0 0 1 * *"      - Monthly on 1st
```

For permanent changes, edit `operating_system/CRONS.json` (or `custom/operating_system/CRONS.json`):

```json
{
  "name": "upstream-update-check",
  "schedule": "0 0 * * *",
  "type": "command",
  "command": "bash check-upstream-updates.sh",
  "enabled": true
}
```

Then restart the Event Handler to apply changes.

### 5. Pause Automatic Updates

To temporarily disable automatic update checks:

**Method 1: Disable via CRONS.json**

```bash
# Edit CRONS.json to set enabled: false
# Location: operating_system/CRONS.json or custom/operating_system/CRONS.json
```

Change:
```json
{
  "name": "upstream-update-check",
  "enabled": false
}
```

**Method 2: Stop via environment variable**

Set an environment variable in the Event Handler:

```bash
export DISABLE_UPSTREAM_CHECKS=true
```

Then modify the cron job to check this variable (requires script update).

### 6. Resume Automatic Updates

To re-enable automatic checks:

```bash
# Edit CRONS.json to set enabled: true
```

Change:
```json
{
  "name": "upstream-update-check",
  "enabled": true
}
```

Then restart the Event Handler.

### 7. Reset Update State

To reset the tracking state (useful after manual merge):

```bash
# Get current upstream commit
git fetch upstream main
CURRENT_SHA=$(git rev-parse upstream/main)

# Update state file to mark as synced
cat > event_handler/cron/.upstream-state.json <<EOF
{
  "last_commit": "$CURRENT_SHA",
  "last_check": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "update_count": 0
}
EOF

echo "State reset to upstream/main @ ${CURRENT_SHA:0:7}"
```

### 8. Force Update Check (Ignore State)

To check for updates regardless of state file:

```bash
# Temporarily move state file
mv event_handler/cron/.upstream-state.json event_handler/cron/.upstream-state.json.bak

# Run check (will treat as first check)
cd event_handler/cron
bash check-upstream-updates.sh

# Restore original state if you don't want to trigger
# mv event_handler/cron/.upstream-state.json.bak event_handler/cron/.upstream-state.json
```

### 9. View Pending Upstream Changes

See what would be updated without triggering a job:

```bash
cd /job
git remote add upstream https://github.com/stephengpope/thepopebot.git 2>/dev/null || true
git fetch upstream main

# Get last synced commit
LAST_COMMIT=$(grep -o '"last_commit":"[^"]*"' event_handler/cron/.upstream-state.json | cut -d'"' -f4)

if [ -n "$LAST_COMMIT" ]; then
  COMMIT_COUNT=$(git rev-list --count $LAST_COMMIT..upstream/main)
  echo "📦 $COMMIT_COUNT new commits available"
  
  echo -e "\n📝 Recent commits:"
  git log --oneline --no-merges $LAST_COMMIT..upstream/main | head -10
  
  echo -e "\n📊 Files that would change:"
  git diff --stat $LAST_COMMIT..upstream/main | head -20
else
  echo "⚠️  No baseline commit recorded. Run check-upstream-updates.sh first."
fi
```

### 10. Test Update Detection

Test the update detection logic without creating a job:

```bash
cd event_handler/cron

# Dry run mode (doesn't trigger agent job)
# This requires modifying the script to support a --dry-run flag
# For now, check manually:

UPSTREAM_OWNER="${UPSTREAM_OWNER:-stephengpope}"
UPSTREAM_REPO="${UPSTREAM_REPO:-thepopebot}"
API_URL="https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/commits/main"

LATEST_SHA=$(curl -s "$API_URL" | grep -o '"sha":"[^"]*"' | head -1 | cut -d'"' -f4)
LAST_SHA=$(grep -o '"last_commit":"[^"]*"' .upstream-state.json | cut -d'"' -f4)

echo "Last synced: ${LAST_SHA:0:7}"
echo "Latest upstream: ${LATEST_SHA:0:7}"

if [ "$LATEST_SHA" = "$LAST_SHA" ]; then
  echo "✓ No updates"
else
  echo "⚠️  Updates available"
fi
```

## Configuration Options

### Environment Variables

These can be set in the Event Handler environment:

- **`UPSTREAM_OWNER`** - GitHub owner of upstream repo (default: `stephengpope`)
- **`UPSTREAM_REPO`** - Repository name (default: `thepopebot`)
- **`UPSTREAM_BRANCH`** - Branch to track (default: `main`)
- **`DISABLE_UPSTREAM_CHECKS`** - Set to `true` to disable automatic checks

### State File Format

The state file at `event_handler/cron/.upstream-state.json`:

```json
{
  "last_commit": "abc123def456...",
  "last_check": "2026-02-19T04:00:00Z",
  "update_count": 5,
  "last_update_found": "2026-02-15T04:00:00Z"
}
```

Fields:
- **`last_commit`** - SHA of the last commit we processed
- **`last_check`** - ISO timestamp of most recent check
- **`update_count`** - Total number of updates detected since tracking started
- **`last_update_found`** - When the most recent update was detected

## Integration with Telegram

The update system works seamlessly with Telegram:

1. **Scheduled check** runs via cron
2. **Updates detected** → Agent job created
3. **Agent merges** upstream changes → Creates PR
4. **Auto-merge** merges PR (if `AUTO_MERGE` enabled and `ALLOWED_PATHS` satisfied)
5. **Notification sent** via Telegram with summary

You can trigger manual checks via Telegram chat:
```
Check for upstream updates
```

## Troubleshooting

### "No new updates" but I know there are updates

Check if the state file has the wrong commit:

```bash
cat event_handler/cron/.upstream-state.json
git fetch upstream main
git rev-parse upstream/main
```

If they don't match and you want to force an update:
```bash
# Reset state to empty
echo '{"last_commit":"","last_check":"","update_count":0}' > event_handler/cron/.upstream-state.json
```

### "Failed to create update job"

Check:
1. Event Handler is running (`curl http://localhost:3000/health`)
2. API_KEY is set correctly
3. GH_TOKEN has repository write permissions
4. Check Event Handler logs for errors

### "Merge conflicts every time"

This suggests custom files are in the wrong location. Run:
```bash
node setup/validate-setup.mjs
```

If customizations are in root directories instead of `/custom/`, migrate them:
```bash
node setup/migrate-to-custom.mjs
```

### State file keeps resetting

Check file permissions:
```bash
ls -la event_handler/cron/.upstream-state.json
```

Ensure the Event Handler user can write to it.

## Example Workflows

### Check Now and Show Results

```bash
cd event_handler/cron
bash check-upstream-updates.sh
cat .upstream-state.json | python3 -m json.tool
```

### Disable for Maintenance

```bash
# Pause updates before making changes
vim operating_system/CRONS.json
# Set "enabled": false for upstream-update-check

# Do your work...

# Re-enable
vim operating_system/CRONS.json
# Set "enabled": true
```

### View Update Without Applying

```bash
git fetch upstream main
LAST_COMMIT=$(grep -o '"last_commit":"[^"]*"' event_handler/cron/.upstream-state.json | cut -d'"' -f4)
git log --oneline $LAST_COMMIT..upstream/main
git diff --stat $LAST_COMMIT..upstream/main
```

### Reset After Manual Merge

```bash
# After manually merging upstream
git fetch upstream main
CURRENT_SHA=$(git rev-parse upstream/main)

cat > event_handler/cron/.upstream-state.json <<EOF
{
  "last_commit": "$CURRENT_SHA",
  "last_check": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "update_count": 0
}
EOF
```

## Security Considerations

- The check script only **reads** from GitHub (no authentication required for public repos)
- Update jobs require **GH_TOKEN** to create branches and PRs
- State file contains only commit hashes and timestamps (no sensitive data)
- Merge conflicts are handled safely - never force-pushes

## Best Practices

1. **Keep custom files in `/custom/`** - Prevents merge conflicts
2. **Review PR before merging** - Even with auto-merge, review changes
3. **Test after updates** - Verify Event Handler and crons still work
4. **Monitor state file** - Ensure updates are being detected
5. **Set appropriate frequency** - Daily is usually sufficient

## Related Documentation

- [docs/UPSTREAM_UPDATES.md](/docs/UPSTREAM_UPDATES.md) - Manual update process
- [operating_system/UPSTREAM_MERGE.md](/operating_system/UPSTREAM_MERGE.md) - Agent merge instructions
- [docs/CUSTOM_CORE.md](/docs/CUSTOM_CORE.md) - Custom/core separation architecture

---

**Quick Reference:**

| Task | Command |
|------|---------|
| Check now | `cd event_handler/cron && bash check-upstream-updates.sh` |
| View state | `cat event_handler/cron/.upstream-state.json` |
| View changes | `git fetch upstream && git log HEAD..upstream/main` |
| Disable checks | Edit CRONS.json, set `enabled: false` |
| Reset state | Edit `.upstream-state.json`, set `last_commit: ""` |
