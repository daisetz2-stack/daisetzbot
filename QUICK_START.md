# Personal Context System - Quick Start Guide

Get up and running with personal context in 5 minutes.

## What You'll Get

After setup, daisetz will:
- Address you by name
- Respect your communication preferences
- Suggest tools based on your expertise
- Reference your active projects
- Adapt to your timezone and working hours

## 3-Step Setup

### Step 1: Pick a Template (30 seconds)

Choose based on your needs:

**Just getting started?**
```bash
cat /job/logs/personal-context/templates/minimal.json
```
Copy this, change the name and timezone, done!

**Software developer?**
```bash
cat /job/logs/personal-context/templates/developer.json
```

**Academic researcher?**
```bash
cat /job/logs/personal-context/templates/researcher.json
```

**Need multi-language support?**
```bash
cat /job/logs/personal-context/templates/multilingual.json
```

### Step 2: Encode It (2 minutes)

**If you don't have LLM_SECRETS yet:**

```bash
# Save your customized context
cat > my-context.json << 'CONTEXT'
{
  "name": "Your Name",
  "timezone": "America/New_York"
}
CONTEXT

# Create LLM_SECRETS
cat > llm-secrets.json << END
{
  "PERSONAL_CONTEXT": $(cat my-context.json | jq -c . | jq -Rs .)
}
END

# Encode for GitHub
cat llm-secrets.json | base64 -w 0
# Copy this output ↑
```

**If you already have LLM_SECRETS:**

```bash
# Decode current secret
echo "YOUR_CURRENT_BASE64" | base64 -d > llm-secrets.json

# Add PERSONAL_CONTEXT
cat llm-secrets.json | jq --rawfile pc my-context.json \
  '.PERSONAL_CONTEXT = ($pc | @json)' > updated.json

# Re-encode
cat updated.json | base64 -w 0
# Copy this output ↑
```

### Step 3: Update GitHub Secret (1 minute)

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Find **LLM_SECRETS** (or click "New repository secret")
3. Paste the base64 string from Step 2
4. Click **Update secret** (or **Add secret**)

Done! 🎉

## Test It

Create a test job:

**Via Telegram:**
```
Test personal context loading
```

**Via webhook:**
```bash
curl -X POST https://your-event-handler.com/webhook \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"job": "Load and display my personal context"}'
```

## What Happens Next?

Every job will now:

1. Load your personal context from LLM_SECRETS
2. Save it to `/logs/personal-context/profile.json`
3. Use it naturally throughout the job:
   - "Hi [YourName]! 👋"
   - Respects your communication style
   - Suggests tools you know
   - References your projects

## Minimal Example

Start super simple:

```json
{
  "name": "Alex"
}
```

That's it! Just your name. You can expand later.

## Standard Example

A good baseline:

```json
{
  "name": "Alex Chen",
  "timezone": "America/Los_Angeles",
  "preferences": {
    "communication_style": "direct"
  },
  "background": {
    "expertise": ["JavaScript", "Python"]
  }
}
```

## Common Fields

- `name` - How you want to be addressed
- `timezone` - IANA timezone (e.g., "America/New_York")
- `preferences.communication_style` - "direct", "friendly", "technical", or "casual"
- `preferences.code_style` - Your coding preferences
- `background.expertise` - Array of skills
- `projects` - Your active projects

## Find Your Timezone

Not sure of your timezone code?

https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

Common ones:
- `America/New_York` - US Eastern
- `America/Los_Angeles` - US Pacific
- `America/Chicago` - US Central
- `Europe/London` - UK
- `Europe/Paris` - Central Europe
- `Asia/Tokyo` - Japan
- `Australia/Sydney` - Australia

## Update Your Context

Changed your mind? Update anytime:

1. Edit your JSON
2. Re-encode: `cat my-context.json | jq -c . | jq -Rs .`
3. Update the GitHub Secret
4. Next job will use the new context

## Troubleshooting

**Context not loading?**
- Check LLM_SECRETS exists in GitHub Settings
- Verify JSON is valid: `cat my-context.json | jq .`
- Test encoding: `echo $PERSONAL_CONTEXT | jq .`

**Invalid JSON error?**
- Validate: `cat my-context.json | jq .`
- Check quotes are properly escaped
- Use a JSON validator online

**Want to start over?**
- Just remove `PERSONAL_CONTEXT` from LLM_SECRETS
- Or set to minimal: `{"name":"Alex"}`

## Next Steps

- **Read more:** `/job/docs/PERSONAL_CONTEXT.md`
- **Setup guide:** `/job/docs/PERSONAL_CONTEXT_SETUP.md`
- **Schema reference:** `/job/.pi/skills/personal-context/SCHEMA.md`

## Privacy Note

Your personal context:
- ✅ Never committed to git
- ✅ Stored in encrypted GitHub Secrets
- ✅ Only accessible during jobs
- ⚠️ Visible to the LLM (Claude)

Don't include:
- ❌ Passwords or API keys
- ❌ Sensitive personal data
- ❌ Confidential information

## That's It!

You're ready to go. Start with something minimal, expand over time, and enjoy more personalized interactions with daisetz.

---

**Questions?** Check the full documentation in `/job/docs/PERSONAL_CONTEXT.md`
