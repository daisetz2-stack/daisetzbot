# Personal Context Schema

This document defines the JSON schema for personal context stored in `PERSONAL_CONTEXT` (LLM_SECRETS).

## Complete Schema

```json
{
  "name": "string - Preferred name/nickname",
  "pronouns": "string - Preferred pronouns (e.g., he/him, she/her, they/them)",
  "timezone": "string - IANA timezone (e.g., America/New_York, Europe/London, Asia/Tokyo)",
  "language": "string - Primary language code (e.g., en, ja, es)",
  
  "preferences": {
    "communication_style": "string - direct|friendly|technical|casual",
    "detail_level": "string - concise|balanced|detailed",
    "code_style": "string - Preferred programming patterns/conventions",
    "notification_hours": "string - When to send notifications (e.g., 9am-9pm)",
    "response_format": "string - Preferred response format preferences"
  },
  
  "background": {
    "role": "string - Current role/position",
    "expertise": ["array", "of", "expertise areas"],
    "interests": ["array", "of", "interests"],
    "learning": ["array", "of", "things currently learning"]
  },
  
  "projects": [
    {
      "name": "string - Project name",
      "description": "string - Brief description",
      "repository": "string - Git repository URL (optional)",
      "status": "string - active|maintenance|planning|archived",
      "priority": "number - 1-5 priority level (optional)"
    }
  ],
  
  "context": {
    "work_environment": "string - Description of work setup",
    "goals": ["array", "of", "current goals"],
    "constraints": ["array", "of", "constraints or limitations"]
  },
  
  "notes": [
    {
      "date": "string - ISO date",
      "category": "string - Category of note",
      "content": "string - Note content"
    }
  ]
}
```

## Minimal Example

The simplest valid personal context:

```json
{
  "name": "Alex"
}
```

## Standard Example

A typical personal context configuration:

```json
{
  "name": "Alex Chen",
  "pronouns": "they/them",
  "timezone": "America/Los_Angeles",
  "language": "en",
  
  "preferences": {
    "communication_style": "direct",
    "detail_level": "balanced",
    "notification_hours": "8am-10pm"
  },
  
  "background": {
    "role": "Software Engineer",
    "expertise": ["JavaScript", "Python", "DevOps", "AI/ML"],
    "interests": ["open source", "automation", "linguistics"],
    "learning": ["Rust", "distributed systems"]
  },
  
  "projects": [
    {
      "name": "daisetz",
      "description": "Personal AI assistant agent",
      "repository": "https://github.com/user/daisetz",
      "status": "active",
      "priority": 1
    }
  ],
  
  "context": {
    "work_environment": "Remote, flexible hours, multiple time zones",
    "goals": [
      "Automate repetitive tasks",
      "Build personal knowledge management system",
      "Learn more about LLM agents"
    ],
    "constraints": [
      "Prefer cost-effective solutions",
      "Must run on standard hardware"
    ]
  }
}
```

## Comprehensive Example

A fully-featured personal context:

```json
{
  "name": "Jordan Kim",
  "pronouns": "she/her",
  "timezone": "Asia/Tokyo",
  "language": "ja",
  
  "preferences": {
    "communication_style": "friendly",
    "detail_level": "detailed",
    "code_style": "Prefer functional programming, strong typing, comprehensive tests",
    "notification_hours": "10am-8pm JST",
    "response_format": "Include code examples, prefer markdown formatting"
  },
  
  "background": {
    "role": "Senior Developer & Tech Lead",
    "expertise": [
      "Full-stack development",
      "Cloud architecture (AWS, GCP)",
      "Machine Learning",
      "Team leadership",
      "Japanese/English technical translation"
    ],
    "interests": [
      "AI ethics",
      "Developer productivity",
      "Cross-cultural tech",
      "Cooking",
      "Hiking"
    ],
    "learning": [
      "Large Language Model fine-tuning",
      "Kubernetes at scale",
      "Go programming language"
    ]
  },
  
  "projects": [
    {
      "name": "daisetz",
      "description": "Personal AI coding assistant with bilingual support",
      "repository": "https://github.com/jordankim/daisetz",
      "status": "active",
      "priority": 1
    },
    {
      "name": "team-dashboard",
      "description": "Internal team metrics and automation dashboard",
      "status": "active",
      "priority": 2
    },
    {
      "name": "llm-toolkit",
      "description": "Reusable components for LLM applications",
      "repository": "https://github.com/jordankim/llm-toolkit",
      "status": "maintenance",
      "priority": 3
    }
  ],
  
  "context": {
    "work_environment": "Hybrid office/remote, Tokyo-based, works with global teams",
    "goals": [
      "Ship daisetz v2 by end of quarter",
      "Reduce manual code review time by 50%",
      "Improve team documentation practices",
      "Give conference talk on AI-assisted development"
    ],
    "constraints": [
      "Limited to company-approved AI services for work projects",
      "Prefers open source solutions when possible",
      "Network restrictions in office environment"
    ]
  },
  
  "notes": [
    {
      "date": "2026-02-15",
      "category": "preferences",
      "content": "Prefers Claude over GPT for code generation - better at following specific formatting rules"
    },
    {
      "date": "2026-02-18",
      "category": "projects",
      "content": "daisetz: Working on adding personal context feature. Need to test with Japanese language content."
    }
  ]
}
```

## How to Configure

### Option 1: GitHub Secrets UI

1. Go to your repository Settings → Secrets and variables → Actions → Secrets
2. Click "New repository secret"
3. Name: `LLM_SECRETS`
4. Value: Base64-encoded JSON containing `PERSONAL_CONTEXT`

Example:
```bash
# Create your personal context JSON
cat > personal-context.json <<'EOF'
{
  "PERSONAL_CONTEXT": "{\"name\":\"Alex\",\"timezone\":\"America/New_York\"}"
}
EOF

# Base64 encode it
cat personal-context.json | base64 -w 0
```

### Option 2: Command Line

```bash
# Create personal context
PERSONAL_CONTEXT_JSON='{
  "name": "Alex",
  "timezone": "America/New_York",
  "preferences": {
    "communication_style": "direct"
  }
}'

# Create LLM_SECRETS with personal context
LLM_SECRETS_JSON=$(cat <<EOF
{
  "PERSONAL_CONTEXT": $(echo "$PERSONAL_CONTEXT_JSON" | jq -c .)
}
EOF
)

# Base64 encode
echo "$LLM_SECRETS_JSON" | base64 -w 0

# Add to GitHub Secrets as LLM_SECRETS
```

### Option 3: Combining with Other LLM Secrets

```json
{
  "PERSONAL_CONTEXT": "{\"name\":\"Alex\",\"timezone\":\"America/New_York\"}",
  "BROWSER_PASSWORD": "secret123",
  "SOME_API_KEY": "key456"
}
```

## Best Practices

### Do ✅

- **Start small** - Begin with just name and timezone, expand as needed
- **Update regularly** - Keep goals and project status current
- **Be specific** - "Prefer detailed code comments" is better than "likes code"
- **Use notes** - Capture preferences and context as you discover them
- **Respect privacy** - Only include what's helpful for the agent

### Don't ❌

- **Over-specify** - Don't include every detail about yourself
- **Include secrets** - No passwords, API keys, or sensitive data (use separate LLM_SECRETS keys)
- **Make it static** - Update context as your work and preferences change
- **Duplicate info** - If it's already in your codebase/docs, don't repeat it

## Field Guidelines

### name
Your preferred name or nickname. The agent uses this to address you naturally.

**Examples:**
- `"Alex"` - Simple and direct
- `"Alex Chen"` - Full name
- `"A.C."` - Initials or nickname

### timezone
IANA timezone identifier. Helps with scheduling and time-aware responses.

**Examples:**
- `"America/New_York"`
- `"Europe/London"`
- `"Asia/Tokyo"`

Find yours: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### communication_style
How you prefer to interact.

**Options:**
- `"direct"` - Brief, to-the-point, minimal pleasantries
- `"friendly"` - Warm, personable, conversational
- `"technical"` - Precise, detailed, technical terminology
- `"casual"` - Relaxed, informal, flexible

### detail_level
How much information you want in responses.

**Options:**
- `"concise"` - Minimal, just the essentials
- `"balanced"` - Standard detail level (default)
- `"detailed"` - Comprehensive explanations and examples

### projects.status
Current state of a project.

**Options:**
- `"active"` - Currently working on it
- `"maintenance"` - Stable, occasional updates
- `"planning"` - Future project, not started
- `"archived"` - No longer active

### projects.priority
Importance level (1-5).

**Scale:**
- `1` - Highest priority, most important
- `2` - High priority
- `3` - Medium priority (default)
- `4` - Low priority
- `5` - Lowest priority, nice-to-have

## Privacy Considerations

Personal context is stored in:
1. **GitHub Secrets** (`LLM_SECRETS`) - Encrypted at rest, only accessible in Actions
2. **Event Handler memory** - In-process only, not persisted
3. **Job container** - Temporary, exists only during job execution
4. **`/logs/personal-context/`** - Local file system, not committed to git

**What this means:**
- ✅ Personal context never appears in git commits
- ✅ Personal context never appears in PR descriptions or comments
- ✅ Session logs may contain references to your context (also in /logs/, not committed)
- ✅ The agent's responses may use your personal info naturally (e.g., "Hi Alex")

**Security:**
- LLM_SECRETS is base64-encoded (encoding, not encryption)
- Only you and GitHub Actions can access the secrets
- The LLM (Claude) will see your personal context
- Don't include anything you wouldn't want in LLM training data

## Updating Context

### During Development

Edit your personal context JSON and re-encode:

```bash
# Edit the JSON
nano personal-context.json

# Re-encode and update GitHub Secret
cat personal-context.json | base64 -w 0
# Then update LLM_SECRETS in GitHub Settings
```

### Via Chat

Ask daisetz to update your context:
```
Update my personal context: Add "TypeScript" to my expertise list
```

The agent will create a job to update the stored context file.

### Programmatically

```bash
# Add a note
/job/.pi/skills/personal-context/update-context.sh notes "$(date -I)" "preferences" "Prefers detailed commit messages"
```

## Troubleshooting

### Context not loading

1. Check LLM_SECRETS is set in GitHub Settings
2. Verify JSON is valid: `echo $PERSONAL_CONTEXT | jq .`
3. Check base64 encoding: `echo $LLM_SECRETS | base64 -d | jq .`

### Context seems outdated

Context is loaded fresh from LLM_SECRETS for each job. If context seems stale:
1. Verify you updated the GitHub Secret
2. Check the job is using the latest version
3. Look at `/logs/personal-context/profile.json` in the job

### Want to reset context

1. Remove PERSONAL_CONTEXT from LLM_SECRETS, or
2. Set it to minimal: `{"PERSONAL_CONTEXT": "{\"name\":\"Alex\"}"}`
