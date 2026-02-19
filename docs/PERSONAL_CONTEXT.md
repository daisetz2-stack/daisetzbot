# Personal Context System

daisetz includes a secure personal context management system that allows you to provide information about yourself, your preferences, and your work. This helps daisetz be more helpful, relevant, and contextually aware.

## What is Personal Context?

Personal context is structured information about you that daisetz can reference during jobs to:

- **Personalize interactions** - Address you by name, respect your preferences
- **Provide relevant suggestions** - Tailor recommendations based on your background and projects
- **Save time** - Avoid repeatedly asking for the same information
- **Work smarter** - Understand your goals, constraints, and working style

## Key Features

✅ **Secure** - Stored in encrypted GitHub Secrets, never committed to git
✅ **Optional** - Works perfectly fine without any personal context
✅ **Flexible** - Start minimal, expand over time as needed
✅ **Private** - Only accessible to your daisetz instance
✅ **Graceful** - System degrades gracefully when context is unavailable

## Quick Start

### 1. Create Your Personal Context

Start with something minimal:

```json
{
  "name": "Alex",
  "timezone": "America/New_York"
}
```

Or use a template from `/job/logs/personal-context/templates/`:
- `minimal.json` - Just name and timezone
- `developer.json` - Software developer profile
- `researcher.json` - Academic/research profile
- `multilingual.json` - Multi-language support

### 2. Add to LLM_SECRETS

Your personal context goes in the `PERSONAL_CONTEXT` key of `LLM_SECRETS`.

**Option A: GitHub UI**

1. Go to your repository → Settings → Secrets and variables → Actions
2. Find or create the `LLM_SECRETS` secret
3. The value should be base64-encoded JSON:

```bash
# Create LLM_SECRETS JSON
cat > llm-secrets.json <<'EOF'
{
  "PERSONAL_CONTEXT": "{\"name\":\"Alex\",\"timezone\":\"America/New_York\"}"
}
EOF

# Base64 encode
cat llm-secrets.json | base64 -w 0

# Copy the output and paste into GitHub Secrets
```

**Option B: Combining with other secrets**

```json
{
  "PERSONAL_CONTEXT": "{\"name\":\"Alex\",\"timezone\":\"America/New_York\"}",
  "BROWSER_PASSWORD": "secret123",
  "SOME_API_KEY": "key456"
}
```

### 3. Test It

Create a test job:
```
Test personal context loading
```

daisetz will load your context and confirm it's working.

## Schema

See `/job/.pi/skills/personal-context/SCHEMA.md` for the complete JSON schema.

**Core Fields:**
- `name` - Your preferred name/nickname
- `timezone` - IANA timezone (e.g., "America/New_York")
- `preferences` - Communication style, detail level, code style, etc.
- `background` - Role, expertise, interests, what you're learning
- `projects` - Current and past projects with status and priority
- `context` - Work environment, goals, constraints
- `notes` - Timestamped notes and observations

**Example:**

```json
{
  "name": "Alex Chen",
  "timezone": "America/Los_Angeles",
  "language": "en",
  
  "preferences": {
    "communication_style": "direct",
    "detail_level": "balanced",
    "code_style": "Prefer TypeScript, functional patterns"
  },
  
  "background": {
    "role": "Software Engineer",
    "expertise": ["JavaScript", "Python", "DevOps"],
    "interests": ["automation", "open source"]
  },
  
  "projects": [
    {
      "name": "daisetz",
      "description": "Personal AI assistant",
      "status": "active",
      "priority": 1
    }
  ]
}
```

## How It Works

### Architecture

```
┌─────────────────┐
│  LLM_SECRETS    │  (GitHub Secrets - encrypted)
│  ┌───────────┐  │
│  │ PERSONAL_ │  │
│  │ CONTEXT   │  │
│  └───────────┘  │
└────────┬────────┘
         │
         │ Decoded at job runtime
         ▼
┌─────────────────┐
│  Docker Agent   │
│  ┌───────────┐  │
│  │ Load      │  │ ──► node load-context.js
│  │ Context   │  │
│  └───────────┘  │
└────────┬────────┘
         │
         │ Save to filesystem
         ▼
┌─────────────────┐
│  /logs/         │  (Not committed to git)
│  personal-      │
│  context/       │
│  ├─ profile.json│
│  ├─ updates.jsonl│
│  └─ notes/      │
└─────────────────┘
```

### Job Lifecycle

1. **Job starts** - Docker container starts with LLM_SECRETS decoded
2. **Context loaded** - `load-context.js` reads `PERSONAL_CONTEXT` from environment
3. **Context saved** - Written to `/logs/personal-context/profile.json`
4. **Agent uses it** - References context naturally throughout the job
5. **Updates recorded** - Any context updates appended to `updates.jsonl`
6. **Job completes** - Context persists in `/logs/` for next job

### Event Handler (Chat)

The Event Handler (Telegram chat) does **not** have direct access to personal context because:
- Personal context is in `LLM_SECRETS`, which is only available in GitHub Actions
- Chat runs on your server, not in the Docker container
- This separation is by design for security

However:
- Jobs created from chat **do** have access to context
- You can tell daisetz to consider personal context when creating jobs
- Chat can ask for preferences directly in conversation

## Using Personal Context

### In Jobs

Personal context is automatically available in all jobs. Load it at the start:

```javascript
const contextResult = JSON.parse(
  execSync('node /job/.pi/skills/personal-context/load-context.js').toString()
);

if (contextResult.available) {
  const ctx = contextResult.context;
  
  // Use the context
  console.log(`Hi ${ctx.name}!`);
  
  if (ctx.preferences?.communication_style === 'direct') {
    // Keep it brief
  }
  
  if (ctx.background?.expertise?.includes('Python')) {
    // Suggest Python solutions
  }
}
```

### Via Skills

Load the personal-context skill:

```bash
# Check if skill is available
ls /job/.pi/skills/personal-context/

# Load context
node /job/.pi/skills/personal-context/load-context.js
```

The skill provides:
- Context loading with error handling
- Update utilities
- Schema validation
- Documentation

### Example Use Cases

**Addressing the user:**
```javascript
const { available, context } = loadContext();
const greeting = available ? `Hi ${context.name}!` : 'Hi there!';
```

**Respecting preferences:**
```javascript
if (context.preferences?.code_style) {
  // Follow their code style guidelines
}
```

**Suggesting relevant tools:**
```javascript
if (context.background?.expertise?.includes('Python')) {
  // Suggest Python-based solution
} else if (context.background?.expertise?.includes('JavaScript')) {
  // Suggest Node.js solution
}
```

**Time awareness:**
```javascript
const userTime = DateTime.now().setZone(context.timezone);
if (userTime.hour < 9) {
  // Maybe don't send notifications yet
}
```

**Project context:**
```javascript
const activeProjects = context.projects?.filter(p => p.status === 'active');
// Suggest connections to their active work
```

## Privacy & Security

### What's Stored Where

| Location | Content | Committed to Git? | Encrypted? |
|----------|---------|-------------------|------------|
| `LLM_SECRETS` (GitHub) | Source of truth | No | Yes (GitHub Secrets) |
| `/logs/personal-context/` | Working copy | No (in .gitignore) | No |
| Session logs | May reference context | No (in .gitignore) | No |
| Agent responses | May use context naturally | Sometimes (in PRs) | No |

### Security Model

**Protected:**
- ✅ Personal context never appears in git commits
- ✅ Personal context never appears in PR file changes
- ✅ Only accessible in GitHub Actions (Docker Agent)
- ✅ Not accessible from Event Handler (server)

**Visible:**
- ⚠️ The LLM (Claude) sees your personal context
- ⚠️ Session logs may reference your context (but not committed)
- ⚠️ Agent responses may naturally use your info ("Hi Alex")

**Not secure for:**
- ❌ Passwords or API keys (use separate `LLM_SECRETS` keys)
- ❌ Sensitive personal information (SSN, health data, etc.)
- ❌ Confidential business information
- ❌ Information you wouldn't want in LLM training data

### Best Practices

**DO ✅**
- Include preferences, working style, background
- Use for name, timezone, projects, interests
- Start minimal and expand over time
- Update as your work changes

**DON'T ❌**
- Store passwords or API keys here
- Include sensitive personal information
- Over-specify every detail
- Leave stale/outdated context

## Updating Context

### Via GitHub Secrets

The primary method - update `LLM_SECRETS` in GitHub Settings:

1. Decode current `LLM_SECRETS`
   ```bash
   echo "YOUR_BASE64_SECRET" | base64 -d | jq .
   ```

2. Edit the `PERSONAL_CONTEXT` field
   ```bash
   # Edit in your favorite editor
   ```

3. Re-encode and update
   ```bash
   cat updated.json | base64 -w 0
   # Update in GitHub Settings
   ```

### Via Chat

Ask daisetz to update your context:
```
Update my personal context: Add React to my expertise list
```

This creates a job that modifies the stored context.

### Programmatically

In a job, update the stored context:
```bash
/job/.pi/skills/personal-context/update-context.sh notes "New preference discovered"
```

This appends to `updates.jsonl` but doesn't modify the source (LLM_SECRETS).

## Troubleshooting

### Context not loading

**Symptom:** Jobs can't find personal context

**Check:**
1. Is `LLM_SECRETS` set in GitHub Settings?
2. Does it include `PERSONAL_CONTEXT`?
3. Is the JSON valid?

```bash
# Validate JSON
echo $PERSONAL_CONTEXT | jq .

# Check in job
node /job/.pi/skills/personal-context/load-context.js
```

### Context seems outdated

**Symptom:** Agent uses old information

**Fix:**
- Update `PERSONAL_CONTEXT` in GitHub Secrets
- Context is loaded fresh for each job
- Check `/logs/personal-context/profile.json` to see what was loaded

### Invalid JSON error

**Symptom:** Parse error when loading context

**Fix:**
1. Validate your JSON: `echo $PERSONAL_CONTEXT | jq .`
2. Check for proper escaping in the base64-encoded value
3. Use a JSON validator before encoding

### Want to reset/remove context

**Option 1:** Remove from LLM_SECRETS entirely
```json
{
  "BROWSER_PASSWORD": "secret123",
  // PERSONAL_CONTEXT removed
}
```

**Option 2:** Set to minimal
```json
{
  "PERSONAL_CONTEXT": "{\"name\":\"Alex\"}"
}
```

## Examples

### Minimal Setup

```json
{
  "name": "Alex"
}
```

Just enough to personalize greetings.

### Standard Setup

```json
{
  "name": "Alex Chen",
  "timezone": "America/Los_Angeles",
  "preferences": {
    "communication_style": "direct",
    "code_style": "TypeScript, functional"
  },
  "background": {
    "role": "Developer",
    "expertise": ["JavaScript", "Python"]
  }
}
```

Good balance of personalization and simplicity.

### Comprehensive Setup

See `/job/logs/personal-context/templates/developer.json` for a full example with:
- Complete preferences
- Detailed background
- Multiple projects
- Goals and constraints
- Notes

## FAQ

**Q: Is personal context required?**
A: No! daisetz works perfectly fine without it. It's purely opt-in.

**Q: Can I use this for API keys?**
A: No, use separate keys in `LLM_SECRETS` for credentials. Personal context should be for preferences and background.

**Q: Will this appear in my git commits?**
A: No, personal context is never committed. `/logs/` is in `.gitignore`.

**Q: Can I have different contexts for different projects?**
A: Currently, context is per-daisetz instance. If you want project-specific context, include it in the `projects` array.

**Q: How often should I update context?**
A: Update when your preferences change, you start new projects, or you discover new preferences. Monthly reviews work well.

**Q: What if I make a mistake in my context JSON?**
A: The loader is fault-tolerant. Invalid JSON returns an error but doesn't break jobs. Fix it in GitHub Secrets and the next job will use the corrected version.

## Advanced Usage

### Context-Aware Job Creation

Create jobs that reference personal context:

```javascript
// In Event Handler
const jobDescription = `
Load personal context and create a code review checklist that follows the user's preferred code style and practices.
`;
```

### Dynamic Responses

```javascript
function formatResponse(message, context) {
  if (!context.available) return message;
  
  const style = context.context.preferences?.communication_style;
  
  if (style === 'concise') {
    return message.split('\n')[0]; // Just the summary
  } else if (style === 'detailed') {
    return message + '\n\nLet me know if you need more detail.';
  }
  
  return message;
}
```

### Project-Specific Context

```javascript
const ctx = loadContext();
const daisetzProject = ctx.context.projects?.find(p => p.name === 'daisetz');

if (daisetzProject && daisetzProject.status === 'active') {
  // Suggest daisetz-related improvements
}
```

## Migration

If you're adding personal context to an existing daisetz instance:

1. **Review templates** - Choose one that matches your use case
2. **Start minimal** - Begin with just name and timezone
3. **Test it** - Create a simple job to verify it works
4. **Expand gradually** - Add more fields as you discover what's helpful
5. **Update periodically** - Keep it current as your work evolves

No changes to existing jobs are required - they'll automatically use context if available.

## Related Documentation

- `/job/.pi/skills/personal-context/SKILL.md` - Skill documentation
- `/job/.pi/skills/personal-context/SCHEMA.md` - Complete JSON schema and examples
- `/job/logs/personal-context/README.md` - Storage directory documentation
- `/job/logs/personal-context/templates/` - Example configurations
- `/job/SECURITY.md` - Overall security documentation
