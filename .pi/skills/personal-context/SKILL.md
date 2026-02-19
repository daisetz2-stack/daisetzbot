---
name: personal-context
description: Load and manage personal context from LLM_SECRETS. Use when you need to reference the user's preferences, background, projects, or other personal information to provide more contextual and personalized responses.
---

# Personal Context Management

This skill provides access to personal information about the user that helps you be more helpful and contextually aware.

## Loading Personal Context

```bash
/job/.pi/skills/personal-context/load-context.js
```

This script:
1. Checks for `PERSONAL_CONTEXT` in LLM_SECRETS
2. Parses and validates the JSON structure
3. Returns formatted personal context or empty state if none available

Output format when context is available:
```json
{
  "available": true,
  "context": {
    "name": "User's preferred name",
    "timezone": "America/New_York",
    "preferences": { ... },
    "background": { ... },
    "projects": [ ... ],
    "notes": [ ... ]
  }
}
```

Output format when no context is available:
```json
{
  "available": false,
  "message": "No personal context configured"
}
```

## When to Use Personal Context

Use personal context to:
- **Address the user naturally** - Use their preferred name and pronouns
- **Respect preferences** - Honor their communication style, technical level, language preferences
- **Provide relevant examples** - Reference their background, interests, or current projects
- **Remember context** - Recall previous conversations or ongoing work
- **Avoid repetition** - Don't ask for information already in their profile

## Graceful Degradation

The system is designed to work perfectly well without personal context:
- Always check if `available` is true before using context
- Never fail or complain if no context is available
- Continue to be helpful using just the current conversation

## Updating Personal Context

To update stored context, use:
```bash
/job/.pi/skills/personal-context/update-context.sh <category> <key> <value>
```

This appends timestamped updates to `/logs/personal-context/updates.jsonl`

## Viewing Stored Context

```bash
cat /logs/personal-context/profile.json
```

## Example Usage

```javascript
// Load context at the start of a job
const context = JSON.parse(execSync('/job/.pi/skills/personal-context/load-context.js').toString());

if (context.available) {
  console.log(`Working on task for ${context.context.name}`);
  // Use context.context.preferences, .background, etc.
} else {
  console.log('No personal context available, proceeding with defaults');
}
```

## Privacy & Security

Personal context is stored in LLM_SECRETS (not filtered from LLM) and `/logs/personal-context/` directory:
- **LLM_SECRETS**: Source of truth, set via GitHub Secrets
- **Local storage**: Persisted notes and updates across jobs
- **Never committed**: `/logs/` is in .gitignore
- **User controlled**: All information is opt-in

## Context Schema

See `/job/.pi/skills/personal-context/SCHEMA.md` for the complete JSON schema and examples.
