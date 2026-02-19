# Personal Context Storage

This directory stores personal context data that persists across jobs.

## Files

- **profile.json** - Current personal context (synced from LLM_SECRETS on each job)
- **updates.jsonl** - Timestamped log of context updates
- **notes/** - Organized personal notes by category
- **templates/** - Example templates for different use cases

## Purpose

Personal context helps daisetz:
- Address you naturally
- Respect your preferences
- Provide relevant examples
- Remember ongoing work
- Avoid asking for known information

## Privacy

**This directory is in .gitignore and never committed.**

All files here are:
- ✅ Local to your machine/server only
- ✅ Not pushed to GitHub
- ✅ Not visible in PRs or commits
- ✅ Only accessible to your daisetz agent

## How It Works

1. **Source**: Personal context is defined in `PERSONAL_CONTEXT` (LLM_SECRETS)
2. **Load**: Each job loads context via `/job/.pi/skills/personal-context/load-context.js`
3. **Persist**: Context is saved to `profile.json` for reference
4. **Update**: Notes and updates are appended to `updates.jsonl`

## Updating Context

### Via LLM_SECRETS (Recommended)

Update `PERSONAL_CONTEXT` in GitHub Secrets (Settings → Secrets and variables → Actions).

See `/job/.pi/skills/personal-context/SCHEMA.md` for the JSON schema.

### Via Update Script

```bash
/job/.pi/skills/personal-context/update-context.sh notes "New note content"
```

This appends to `updates.jsonl` but doesn't modify the source (LLM_SECRETS).

### Via Chat

```
Update my personal context: Add TypeScript to my expertise
```

## Example Workflow

1. **Initial Setup**
   ```bash
   # Set up minimal context
   PERSONAL_CONTEXT='{"name":"Alex","timezone":"America/New_York"}'
   ```

2. **First Job**
   - Agent loads context
   - Saves to profile.json
   - Uses name and timezone

3. **Over Time**
   - Add preferences as you discover them
   - Update project status
   - Add notes about preferences
   - Expand expertise and interests

4. **Maintenance**
   - Review profile.json occasionally
   - Update LLM_SECRETS with refined context
   - Archive old updates if needed

## Templates

See `templates/` for example configurations:
- `minimal.json` - Bare minimum setup
- `developer.json` - Software developer profile
- `researcher.json` - Academic/research profile
- `multilingual.json` - Multi-language support example
