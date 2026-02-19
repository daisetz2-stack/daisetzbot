# Upstream Updates - Quick Reference Card

One-page reference for managing upstream updates in thepopebot.

## 🔄 Automatic Updates (Recommended)

### Enable
```bash
# In operating_system/CRONS.json
{
  "name": "upstream-update-check",
  "enabled": true
}
```

### Disable
```bash
# In operating_system/CRONS.json
{
  "name": "upstream-update-check",
  "enabled": false
}
```

### Check Now
```bash
cd event_handler/cron && bash check-upstream-updates.sh
```

### View Status
```bash
cd event_handler/cron && bash view-upstream-status.sh
```

### Test Configuration
```bash
cd event_handler/cron && bash test-upstream-check.sh
```

## ⏰ Update Frequency

Edit `operating_system/CRONS.json`:

| Schedule | Frequency |
|----------|-----------|
| `0 2 * * *` | Daily at 2am (default) |
| `0 */12 * * *` | Every 12 hours |
| `0 0 * * 0` | Weekly (Sunday) |
| `0 0 1 * *` | Monthly (1st) |

## 📊 Monitoring

### Current State
```bash
cat event_handler/cron/.upstream-state.json
```

### Pending Changes
```bash
git fetch upstream main
LAST=$(grep -o '"last_commit":"[^"]*"' event_handler/cron/.upstream-state.json | cut -d'"' -f4)
git log --oneline $LAST..upstream/main
```

### Update History
```bash
cat event_handler/cron/.upstream-state.json | grep update_count
```

## 🔧 Manual Updates

### Full Merge
```bash
git fetch upstream && git merge upstream/main
```

### Selective Files
```bash
git fetch upstream
git checkout upstream/main -- docs/
git commit -m "Update docs from upstream"
```

### Cherry-Pick Commit
```bash
git fetch upstream
git cherry-pick <commit-hash>
```

## ⚙️ Configuration

### Change Upstream Source
```bash
# In Event Handler environment
export UPSTREAM_OWNER=myusername
export UPSTREAM_REPO=my-fork
export UPSTREAM_BRANCH=develop
```

### Auto-Merge Control
```bash
# In GitHub repo variables (Settings → Actions → Variables)
AUTO_MERGE=false          # Require manual review
ALLOWED_PATHS=/logs,/docs # Restrict auto-merge paths
```

## 🚨 Troubleshooting

### No Updates Detected
```bash
# Reset state
echo '{"last_commit":"","last_check":"","update_count":0}' > event_handler/cron/.upstream-state.json
```

### Merge Conflicts
```bash
# View conflicts
git status

# Abort merge
git merge --abort

# Or manually resolve, then:
git add .
git commit
```

### Job Not Created
```bash
# Check Event Handler
curl http://localhost:3000/health

# Check API_KEY
echo $API_KEY

# Check logs
pm2 logs event-handler
```

## 📱 Telegram Commands

```
Check for upstream updates
```

## 🛡️ Safety Features

| Feature | Protection |
|---------|------------|
| **custom/** | Protected by merge=ours |
| **State tracking** | No duplicate notifications |
| **PR review** | All changes visible before merge |
| **AUTO_MERGE** | Can require manual approval |
| **ALLOWED_PATHS** | Restrict what auto-merges |
| **Git history** | Can revert any merge |

## 📚 Documentation

| Doc | Purpose |
|-----|---------|
| [AUTOMATIC_UPDATES.md](./AUTOMATIC_UPDATES.md) | Complete guide (20+ pages) |
| [UPSTREAM_UPDATES.md](./UPSTREAM_UPDATES.md) | Manual procedures |
| [upstream-updates skill](../.pi/skills/upstream-updates/SKILL.md) | Management commands |
| [UPSTREAM_MERGE.md](../operating_system/UPSTREAM_MERGE.md) | Agent instructions |
| [custom/README.md](../custom/README.md) | Custom directory guide |

## 🎯 Common Tasks

### "I want automatic updates"
```bash
vim operating_system/CRONS.json
# Set enabled: true for upstream-update-check
pm2 restart event-handler
```

### "I want to review every update"
```bash
# In GitHub repo variables
AUTO_MERGE=false
```

### "Check if updates are available"
```bash
cd event_handler/cron && bash view-upstream-status.sh
```

### "Update now"
```bash
cd event_handler/cron && bash check-upstream-updates.sh
```

### "I broke something, rollback"
```bash
git log --oneline  # Find merge commit
git revert -m 1 <merge-commit-sha>
git push
```

### "Pause auto-updates temporarily"
```bash
vim operating_system/CRONS.json
# Set enabled: false
pm2 restart event-handler
```

### "See what changed in last update"
```bash
git log -1 -p  # Last commit with diff
```

## 🔍 State File Format

```json
{
  "last_commit": "abc123...",     // Last synced commit SHA
  "last_check": "2026-02-19T...", // Last check timestamp
  "update_count": 5,              // Total updates found
  "last_update_found": "2026-..."  // When last update detected
}
```

## ✅ Quick Health Check

```bash
# 1. Script executable?
ls -la event_handler/cron/check-upstream-updates.sh

# 2. Cron enabled?
grep -A 3 "upstream-update-check" operating_system/CRONS.json

# 3. Event Handler running?
curl http://localhost:3000/health

# 4. State file valid?
cat event_handler/cron/.upstream-state.json

# 5. Can reach GitHub?
curl -s https://api.github.com/repos/stephengpope/thepopebot/commits/main | head -5
```

## 💡 Pro Tips

1. **Keep customizations in `/custom/`** - Prevents merge conflicts
2. **Review PRs before merging** - Even with auto-merge enabled
3. **Test after updates** - Restart Event Handler and verify
4. **Backup before major updates** - Create backup branch
5. **Monitor state file** - Ensure updates are being detected

---

**Need more details?** See [docs/AUTOMATIC_UPDATES.md](./AUTOMATIC_UPDATES.md)

**Having issues?** Run: `cd event_handler/cron && bash test-upstream-check.sh`
