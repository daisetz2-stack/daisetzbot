# Personal Context Setup Guide

Step-by-step guide to setting up personal context for your daisetz instance.

## Prerequisites

- A daisetz instance set up with GitHub Actions
- Access to your repository settings
- Basic familiarity with JSON

## Setup Steps

### Step 1: Choose Your Template

Start by selecting a template that matches your use case:

**Minimal** - Just the basics
```bash
cat /job/logs/personal-context/templates/minimal.json
```

**Developer** - Software engineering focused
```bash
cat /job/logs/personal-context/templates/developer.json
```

**Researcher** - Academic/research focused
```bash
cat /job/logs/personal-context/templates/researcher.json
```

**Multilingual** - Multi-language support
```bash
cat /job/logs/personal-context/templates/multilingual.json
```

### Step 2: Customize Your Context

Copy a template and customize it:

```bash
# Copy a template
cp /job/logs/personal-context/templates/developer.json my-context.json

# Edit it
nano my-context.json
```

**Replace these placeholders:**
- `"name": "Your Name"` → Your actual name
- `"timezone": "America/New_York"` → Your timezone ([find yours](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
- Update expertise, interests, projects, etc.

**Keep it relevant:**
- Only include what's helpful for daisetz to know
- Don't include sensitive information
- Start minimal, expand over time

### Step 3: Validate Your JSON

Make sure your JSON is valid:

```bash
cat my-context.json | jq .
```

If this prints your JSON prettily, it's valid. If you get an error, fix the syntax issue.

### Step 4: Encode for GitHub Secrets

Personal context goes in `LLM_SECRETS`. Here's how to encode it:

**If you don't have LLM_SECRETS yet:**

```bash
# Create a new LLM_SECRETS with just personal context
cat > llm-secrets.json <<EOF
{
  "PERSONAL_CONTEXT": $(cat my-context.json | jq -c . | jq -Rs .)
}
EOF

# Base64 encode it
cat llm-secrets.json | base64 -w 0
```

**If you already have LLM_SECRETS:**

```bash
# Decode current LLM_SECRETS
echo "YOUR_CURRENT_LLM_SECRETS_BASE64" | base64 -d > llm-secrets.json

# Add/update PERSONAL_CONTEXT
cat llm-secrets.json | jq --rawfile pc my-context.json '.PERSONAL_CONTEXT = ($pc | @json)' > llm-secrets-updated.json

# Re-encode
cat llm-secrets-updated.json | base64 -w 0
```

### Step 5: Update GitHub Secret

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Find **LLM_SECRETS** (or click "New repository secret" if it doesn't exist)
4. Paste the base64-encoded value from Step 4
5. Click **Update secret** (or **Add secret**)

### Step 6: Test It

Create a test job via Telegram or webhook:

```
Test personal context: Load my personal context and confirm it's working correctly
```

Or create a minimal test:

```bash
# Via webhook
curl -X POST https://your-event-handler.com/webhook \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "job": "Run: node /job/.pi/skills/personal-context/load-context.js"
  }'
```

### Step 7: Verify

Check the job output:

1. Wait for the job to complete
2. Check the PR description or session log
3. Look for confirmation that context was loaded
4. Verify `/logs/personal-context/profile.json` was created

## Updating Context

### Quick Update (GitHub UI)

1. Go to Settings → Secrets and variables → Actions
2. Find `LLM_SECRETS`, click edit
3. Decode, edit `PERSONAL_CONTEXT`, re-encode
4. Update secret

### Programmatic Update

```bash
# Get current secret (requires GH CLI)
gh secret list

# This is manual - GitHub doesn't allow reading secret values
# So you'll need to decode, edit, and re-encode manually
```

### Via Chat

```
Update my personal context: Add Python to my expertise
```

This creates a job to update the stored context (in `/logs/`), but you'll still need to update the GitHub Secret for it to persist across jobs.

## Common Scenarios

### Scenario: New Project Started

Update your context to include the new project:

```json
{
  "projects": [
    {
      "name": "new-project",
      "description": "Description here",
      "status": "active",
      "priority": 1
    }
  ]
}
```

### Scenario: Preferences Changed

Update communication or code style preferences:

```json
{
  "preferences": {
    "communication_style": "technical",
    "code_style": "Prefer Rust, focus on performance"
  }
}
```

### Scenario: Learning New Technology

Add to your learning list:

```json
{
  "background": {
    "learning": ["Rust", "WebAssembly", "Kubernetes"]
  }
}
```

### Scenario: Timezone Changed

Update your timezone when you move or travel:

```json
{
  "timezone": "Europe/London"
}
```

## Troubleshooting

### "No personal context configured"

**Cause:** `PERSONAL_CONTEXT` not found in `LLM_SECRETS`

**Fix:**
1. Check that `LLM_SECRETS` exists in GitHub Secrets
2. Decode it and verify `PERSONAL_CONTEXT` is present
3. Ensure proper JSON structure

### "Failed to parse PERSONAL_CONTEXT"

**Cause:** Invalid JSON in `PERSONAL_CONTEXT`

**Fix:**
1. Decode `LLM_SECRETS`
2. Extract `PERSONAL_CONTEXT` and validate: `echo $PERSONAL_CONTEXT | jq .`
3. Fix JSON syntax errors
4. Re-encode and update secret

### Context seems stale

**Cause:** Updated context in GitHub but old data still loading

**Fix:**
1. Verify the secret was actually updated in GitHub
2. Clear browser cache if using GitHub UI
3. Create a new job to test
4. Check `/logs/personal-context/profile.json` in the new job

### Base64 encoding issues

**Cause:** Incorrect encoding or newlines in base64

**Fix:**
```bash
# Use -w 0 to prevent line wrapping
cat file.json | base64 -w 0

# Or on macOS
cat file.json | base64
```

### Double-encoding issues

**Cause:** `PERSONAL_CONTEXT` value is double-JSON-encoded

**Fix:**
```bash
# WRONG: Double-encoded
"PERSONAL_CONTEXT": "\"{\\\"name\\\":\\\"Alex\\\"}\""

# RIGHT: Single-encoded (string value)
"PERSONAL_CONTEXT": "{\"name\":\"Alex\"}"

# Use jq to ensure proper encoding
cat context.json | jq -c . | jq -Rs .
```

## Best Practices

### Start Minimal

Begin with just name and timezone:
```json
{
  "name": "Alex",
  "timezone": "America/New_York"
}
```

Expand as you discover what's useful.

### Update Regularly

Review and update your context:
- **Weekly**: During active development
- **Monthly**: For general maintenance
- **As needed**: When preferences change

### Use Version Control

Keep a local copy of your context for reference:

```bash
# Save template
cp my-context.json ~/daisetz-context-backup.json

# Or use git (in a separate private repo)
git init ~/daisetz-context
cd ~/daisetz-context
cp my-context.json context.json
git add context.json
git commit -m "Initial context"
```

### Test Changes

Before updating GitHub Secret, test locally:

```bash
PERSONAL_CONTEXT=$(cat my-context.json | jq -c .) node /job/.pi/skills/personal-context/load-context.js
```

### Document Preferences

Use the `notes` field to document discovered preferences:

```json
{
  "notes": [
    {
      "date": "2026-02-19",
      "category": "code",
      "content": "Prefers async/await over promises.then()"
    }
  ]
}
```

## Security Checklist

Before adding to personal context, ask:

- [ ] Is this information useful for daisetz to know?
- [ ] Would I be comfortable with this in LLM training data?
- [ ] Does this contain passwords, API keys, or secrets? (If yes, use separate `LLM_SECRETS` keys)
- [ ] Does this contain sensitive personal information? (If yes, reconsider)
- [ ] Is this information I'd share with a human assistant?

## Next Steps

Once your personal context is set up:

1. **Test with real jobs** - See how daisetz uses your context
2. **Refine over time** - Update based on what's helpful
3. **Explore templates** - Look at other templates for ideas
4. **Read the docs** - See [PERSONAL_CONTEXT.md](/job/docs/PERSONAL_CONTEXT.md) for advanced usage

## Quick Reference

**Load context in a job:**
```javascript
const ctx = JSON.parse(execSync('node /job/.pi/skills/personal-context/load-context.js').toString());
```

**Check if available:**
```javascript
if (ctx.available) {
  // Use ctx.context
}
```

**Update stored context:**
```bash
/job/.pi/skills/personal-context/update-context.sh category key value
```

**View stored context:**
```bash
cat /job/logs/personal-context/profile.json
```

**Encode for GitHub:**
```bash
cat context.json | jq -c . | jq -Rs .  # Get PERSONAL_CONTEXT value
```
