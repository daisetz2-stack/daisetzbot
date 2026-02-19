# Upstream Merge Task

You are performing an **automatic upstream update** for thepopebot. Your goal is to safely merge the latest changes from the upstream repository while preserving all custom configurations.

## Overview

The thepopebot repository uses a custom/core separation architecture:
- **Core files** (root directories) - Updated from upstream
- **Custom files** (`/custom/`) - Protected customizations
- **Automatic fallback** - System checks `/custom/` first, then defaults

Your task is to merge upstream changes and create a PR with a summary of what changed.

## Step-by-Step Process

### 1. Add Upstream Remote (if not already added)

```bash
git remote add upstream https://github.com/stephengpope/thepopebot.git 2>/dev/null || echo "Upstream already exists"
git fetch upstream
```

### 2. Check Current State

```bash
# See what branch we're on
git branch --show-current

# See current commit
git log -1 --oneline

# Check for any uncommitted changes
git status
```

### 3. Fetch Upstream Changes

```bash
git fetch upstream main
```

### 4. Analyze What Changed

Generate a comprehensive summary of changes:

```bash
# Get commit list
git log HEAD..upstream/main --oneline --no-merges > /tmp/upstream-commits.txt

# Get file changes
git diff HEAD..upstream/main --stat > /tmp/upstream-changes.txt

# Get detailed diff of key files (to understand impact)
git diff HEAD..upstream/main -- README.md > /tmp/diff-readme.txt 2>/dev/null || true
git diff HEAD..upstream/main -- package.json > /tmp/diff-package.txt 2>/dev/null || true
git diff HEAD..upstream/main -- Dockerfile > /tmp/diff-dockerfile.txt 2>/dev/null || true
```

Review these files and categorize changes:
- **Core Infrastructure** - Workflows, Docker, entrypoint
- **Event Handler** - Server, cron, triggers, actions
- **Skills & Tools** - New or updated skills
- **Documentation** - README, docs folder
- **Dependencies** - package.json changes

### 5. Perform the Merge

```bash
# Merge upstream changes
git merge upstream/main -m "Merge upstream updates: $(date +%Y-%m-%d)"
```

**Expected behavior:**
- `.gitattributes` defines merge strategies that protect `/custom/`
- Most merges should be automatic and conflict-free
- If conflicts occur, proceed to conflict resolution

### 6. Handle Merge Conflicts (if any)

If you encounter conflicts:

```bash
# See which files have conflicts
git status

# For each conflicting file, examine it
cat <conflicted-file>
```

**Conflict resolution strategy:**
- **Core files** (Dockerfile, entrypoint.sh, event_handler/, .github/) - Accept upstream version
- **Custom files** (`/custom/`) - Keep local version (but conflicts here are rare due to merge strategy)
- **README.md** - Manually merge, keeping both versions when possible
- **package.json** - Merge dependencies, keeping both

After resolving:
```bash
git add .
git commit -m "Resolve merge conflicts: prefer upstream for core, preserve custom"
```

### 7. Verify the Merge

Run validation checks:

```bash
# Check that custom files still exist and are valid
ls -la custom/operating_system/

# Validate JSON files
node -e "JSON.parse(require('fs').readFileSync('operating_system/CRONS.json', 'utf8'))" && echo "✓ CRONS.json valid"
node -e "JSON.parse(require('fs').readFileSync('operating_system/TRIGGERS.json', 'utf8'))" && echo "✓ TRIGGERS.json valid"

# Check package.json is valid
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" && echo "✓ package.json valid"

# Ensure no merge conflict markers remain
! grep -r "<<<<<<< HEAD" . --exclude-dir=node_modules --exclude-dir=.git || echo "⚠️  Merge markers found"
```

### 8. Generate PR Summary

Create a comprehensive summary file at `/tmp/upstream-merge-summary.md`:

```markdown
# Upstream Merge Summary

**Date:** $(date +%Y-%m-%d)
**From:** [previous commit hash]
**To:** [new commit hash]
**Commits:** [number] new commits

## Changes Overview

### Core Infrastructure
- List workflow changes
- List Dockerfile changes
- List entrypoint changes

### Event Handler
- List server.js changes
- List new features
- List bug fixes

### Skills & Tools
- List new skills
- List skill updates

### Documentation
- List doc updates

### Dependencies
- List new dependencies
- List updated dependencies

## Merge Status

- **Conflicts:** [Yes/No]
- **Conflicts Resolved:** [Yes/No/N/A]
- **Validation:** [Pass/Fail]

## Testing Recommendations

1. Test Event Handler startup
2. Test cron job execution
3. Test webhook triggers
4. Test new skills (if any)

## Notes

[Any additional notes about the merge, breaking changes, or manual steps needed]
```

Read the generated summaries and fill in the template with actual data.

### 9. Create PR

The merge is complete and committed. The PR will be auto-created by the entrypoint.sh script.

**PR Title:**
```
Upstream merge: [Short summary of major changes]
```

**PR Description:**
Include the contents of `/tmp/upstream-merge-summary.md`

### 10. Document the Update

Update the state tracking file with details:

```bash
# This is done automatically by the check script, but verify it
cat event_handler/cron/.upstream-state.json
```

## Error Handling

### If Merge Fails

If `git merge` fails completely:

1. **Abort the merge:**
```bash
git merge --abort
```

2. **Create a detailed error report:**
```bash
cat > /tmp/merge-error-report.md <<EOF
# Upstream Merge Failed

**Error:** $(git merge upstream/main 2>&1)

**Conflicts:**
$(git diff --name-only --diff-filter=U 2>/dev/null || echo "N/A")

**Recommended Action:**
Manual merge required. The automatic merge could not resolve conflicts in critical files.

**Next Steps:**
1. Review conflicts manually
2. Understand what upstream changed
3. Carefully merge while preserving customizations
EOF
```

3. **Commit the error report:**
```bash
git add /tmp/merge-error-report.md
git commit -m "Upstream merge failed: Manual intervention needed"
```

4. **Create PR anyway** - The PR will document the failure and allow manual review

### If Validation Fails

If post-merge validation catches issues:

1. **Document the issues**
2. **Attempt to fix automatically** (e.g., fix JSON syntax)
3. **If unfixable, document in PR** for manual review

## Success Criteria

✅ **Merge completed** - `git merge` succeeded or conflicts were resolved
✅ **No merge markers** - No `<<<<<<<` markers remain in files
✅ **JSON valid** - All JSON config files parse correctly
✅ **Custom files intact** - Files in `/custom/` are unchanged or intentionally updated
✅ **Summary generated** - Complete summary of what changed
✅ **Committed** - All changes committed to the job branch

## What Gets Auto-Merged

According to `.gitattributes`, these merge automatically:

- **`custom/**`** → Your version always wins (merge=ours)
- **`.github/**`** → Upstream version wins (merge=theirs)
- **`event_handler/**`** → Upstream version wins (merge=theirs)
- **`docs/**`** → Both versions merged (merge=union)
- **Core files** (Dockerfile, entrypoint.sh) → Upstream wins (merge=theirs)

## Final Output

Your completed work should include:

1. **Merged changes** committed to the job branch
2. **Summary file** at `/tmp/upstream-merge-summary.md`
3. **Validation results** confirming everything works
4. **PR ready** with comprehensive description

The PR will be created automatically when the agent completes. The auto-merge workflow will review it according to `AUTO_MERGE` and `ALLOWED_PATHS` settings.

---

**Remember:** This is a safe operation because of the custom/core separation. Even if something goes wrong, custom configurations are protected by the merge strategy defined in `.gitattributes`.
