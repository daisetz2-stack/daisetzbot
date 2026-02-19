# Custom Configuration Directory

This directory contains your customizations for daisetz. Files here take precedence over defaults in `/operating_system/` and `.pi/skills/`.

## Why Use `/custom/`?

The custom/core separation architecture allows you to:
- ✅ **Pull upstream updates** without losing your customizations
- ✅ **Preserve your configurations** during git merges
- ✅ **Version control your customizations** separately from core code
- ✅ **Override defaults** cleanly without editing core files

## Directory Structure

```
custom/
├── operating_system/      # Your bot configuration
│   ├── SOUL.md           # Your personality and identity
│   ├── CHATBOT.md        # Your Telegram chat system prompt
│   ├── CRONS.json        # Your scheduled jobs
│   ├── TRIGGERS.json     # Your webhook triggers
│   ├── HEARTBEAT.md      # Your self-monitoring behavior (optional)
│   └── *.md              # Any custom task instructions
│
└── skills/               # Your custom skills
    ├── my-skill/
    │   └── SKILL.md
    └── another-skill/
        └── SKILL.md
```

## How It Works

When daisetz starts, it checks for files in this order:

1. **custom/operating_system/SOUL.md** ← Loaded first
2. If not found → **operating_system/SOUL.md** ← Fallback

This pattern applies to all configuration files:
- SOUL.md (agent personality)
- CHATBOT.md (chat system prompt)
- CRONS.json (scheduled jobs)
- TRIGGERS.json (webhook triggers)
- Any .md files referenced in jobs

### Skills Resolution

Skills follow the same pattern but merge both locations:

1. Load skills from **custom/skills/** (your custom skills)
2. Load skills from **.pi/skills/** (core/example skills)
3. If same name exists in both, custom version takes precedence

## Getting Started

### 1. Create Your Custom Configuration

Copy defaults and customize:

```bash
# Copy default configs to custom location
mkdir -p custom/operating_system
cp operating_system/SOUL.md custom/operating_system/
cp operating_system/CRONS.json custom/operating_system/
cp operating_system/TRIGGERS.json custom/operating_system/

# Now edit your custom versions
vim custom/operating_system/SOUL.md
vim custom/operating_system/CRONS.json
```

### 2. Create Custom Skills

```bash
# Create a new skill
mkdir -p custom/skills/my-skill
cat > custom/skills/my-skill/SKILL.md <<EOF
# My Custom Skill

Description of what this skill does...

## When to Use

Use when...

## Commands

...
EOF
```

### 3. Restart Event Handler

```bash
# Restart to load new configuration
pm2 restart event-handler
# or
systemctl restart daisetz-event-handler
```

### 4. Verify Custom Files Are Loaded

Check Event Handler logs on startup:

```bash
pm2 logs event-handler --lines 50
```

Look for:
```
--- Loading Configuration ---
SOUL: /job/custom/operating_system/SOUL.md ✓
CHATBOT: /job/custom/operating_system/CHATBOT.md ✓
---
--- Cron Jobs (custom) ---
  my-custom-cron: 0 9 * * * (agent)
---
```

## What to Customize

### Essential Files

**`SOUL.md`** - Define your agent's personality
```markdown
# My Bot's Identity

You are a specialized bot that does X, Y, Z...

## Personality Traits
- Expert in finance
- Concise communicator
- Data-driven decision maker

## Values
- Accuracy over speed
- Transparency in reasoning
```

**`CRONS.json`** - Your scheduled tasks
```json
[
  {
    "name": "daily-report",
    "schedule": "0 9 * * *",
    "type": "agent",
    "job": "Generate and send daily report",
    "enabled": true
  }
]
```

**`CHATBOT.md`** - Your Telegram chat behavior
```markdown
You are a helpful assistant specialized in...
```

### Optional Files

**`HEARTBEAT.md`** - Self-monitoring tasks
```markdown
# Self-Check Tasks

1. Verify API keys are valid
2. Check for critical errors in logs
3. Ensure disk space > 10GB
```

**Custom task instructions** - Any .md file
```markdown
# Daily Financial Analysis Task

1. Fetch market data
2. Analyze trends
3. Generate report
4. Send via Telegram
```

## Merge Behavior

The `.gitattributes` file ensures your customizations are protected:

```
# Your custom files always win during git merge
custom/** merge=ours
```

This means when you run `git merge upstream/main`:
- ✅ Core code updates automatically
- ✅ Your custom files are never touched
- ✅ No conflicts in `/custom/`

## Migration from Old Structure

If you have an existing daisetz with customizations in `/operating_system/`:

```bash
# Use the migration tool
node setup/migrate-to-custom.mjs
```

This automatically:
1. Copies your customizations to `/custom/`
2. Leaves defaults in place for fallback
3. Updates any references in your code

## Best Practices

### 1. Document Your Customizations

Keep notes in this README:

```markdown
## My Customizations

- **SOUL.md**: Changed to financial advisor personality
- **CRONS.json**: Added daily market analysis at 9am
- **Skills**: Added pdf-parser, email-sender
- **Triggers**: Added Stripe webhook integration
```

### 2. Version Control Custom Changes

Commit your custom files separately:

```bash
git add custom/
git commit -m "Add custom financial advisor configuration"
```

### 3. Use Descriptive Names

```bash
# ✅ Good
custom/operating_system/FINANCIAL_ANALYSIS.md

# ❌ Bad
custom/operating_system/task1.md
```

### 4. Test After Upstream Updates

After merging upstream changes:

```bash
# 1. Verify custom files still exist
ls -la custom/operating_system/

# 2. Restart Event Handler
pm2 restart event-handler

# 3. Check logs for any errors
pm2 logs event-handler --lines 50
```

### 5. Backup Before Major Changes

```bash
# Create backup branch
git checkout -b backup-custom-$(date +%Y%m%d)
git add custom/
git commit -m "Backup custom configuration"
git push origin backup-custom-$(date +%Y%m%d)
git checkout main
```

## Examples

### Example 1: Financial Advisor Bot

```bash
custom/
├── operating_system/
│   ├── SOUL.md                    # Financial expert personality
│   ├── CRONS.json                 # Daily market analysis cron
│   ├── FINANCIAL_ANALYSIS.md      # Analysis task instructions
│   └── PORTFOLIO_REVIEW.md        # Portfolio review task
└── skills/
    ├── stock-data/                # Fetch stock prices
    ├── financial-news/            # Scrape financial news
    └── report-generator/          # Generate PDF reports
```

### Example 2: DevOps Monitor Bot

```bash
custom/
├── operating_system/
│   ├── SOUL.md                    # DevOps engineer personality
│   ├── CRONS.json                 # Hourly system checks
│   ├── SYSTEM_CHECK.md            # System health check task
│   └── TRIGGERS.json              # GitHub webhook triggers
└── skills/
    ├── server-monitor/            # Check server health
    ├── deploy-automation/         # Automated deployments
    └── alert-manager/             # Send alerts
```

### Example 3: Content Curator Bot

```bash
custom/
├── operating_system/
│   ├── SOUL.md                    # Curator personality
│   ├── CRONS.json                 # Daily content collection
│   ├── CONTENT_CURATION.md        # Curation task
│   └── CHATBOT.md                 # Friendly chat style
└── skills/
    ├── web-scraper/               # Scrape content
    ├── content-analyzer/          # Analyze quality
    └── social-poster/             # Post to social media
```

## Troubleshooting

### Custom files not being loaded

**Check:**
1. Files are in correct location: `custom/operating_system/`
2. File names match exactly (case-sensitive)
3. Event Handler was restarted after changes
4. No syntax errors in JSON files

```bash
# Validate JSON
python3 -m json.tool custom/operating_system/CRONS.json
```

### Upstream merge conflicts in custom files

This shouldn't happen due to `.gitattributes`, but if it does:

```bash
# Check merge attributes are configured
cat .gitattributes | grep custom

# Should show:
# custom/** merge=ours

# If missing, add it:
echo "custom/** merge=ours" >> .gitattributes
```

### Skills from custom directory not recognized

**Check:**
1. Skill has proper directory structure: `custom/skills/skill-name/SKILL.md`
2. SKILL.md contains proper frontmatter
3. Event Handler logs show skill was loaded

```bash
# Check skill structure
ls -la custom/skills/*/SKILL.md
```

### Changes not taking effect

**Ensure restart:**
```bash
pm2 restart event-handler
# or
systemctl restart daisetz-event-handler
```

**Check logs:**
```bash
pm2 logs event-handler --lines 100
```

## Advanced Customization

### Environment-Specific Configs

Use environment variables to switch between configs:

```bash
# In Event Handler startup script
if [ "$ENVIRONMENT" = "production" ]; then
  export CUSTOM_CONFIG_DIR="custom/production"
else
  export CUSTOM_CONFIG_DIR="custom/development"
fi
```

### Shared Configs Across Instances

Symlink to shared storage:

```bash
# Link to network storage
ln -s /mnt/shared/daisetz-config custom/operating_system
```

### Per-Instance Customization

For multiple bot instances:

```bash
# Instance 1
custom/instance1/operating_system/
custom/instance1/skills/

# Instance 2
custom/instance2/operating_system/
custom/instance2/skills/
```

## See Also

- [docs/UPSTREAM_UPDATES.md](/docs/UPSTREAM_UPDATES.md) - Pulling updates from upstream
- [docs/AUTOMATIC_UPDATES.md](/docs/AUTOMATIC_UPDATES.md) - Automatic update system
- [setup/migrate-to-custom.mjs](/setup/migrate-to-custom.mjs) - Migration tool
- [.gitattributes](../.gitattributes) - Merge strategies

---

**Quick Start:**

```bash
# 1. Create custom configuration
mkdir -p custom/operating_system custom/skills
cp operating_system/SOUL.md custom/operating_system/

# 2. Customize
vim custom/operating_system/SOUL.md

# 3. Restart
pm2 restart event-handler

# 4. Verify
pm2 logs event-handler | grep "custom"
```

Now you're ready to customize daisetz without losing changes during upstream updates! 🎨
