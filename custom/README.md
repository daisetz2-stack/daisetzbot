# Custom Configuration Directory

This directory contains your bot's customizations. Files here take precedence over defaults in `/operating_system/` and `/.pi/skills/`.

## Structure

```
custom/
├── operating_system/     # Your bot's personality and configuration
│   ├── SOUL.md          # Bot personality (overrides /operating_system/SOUL.md)
│   ├── CHATBOT.md       # Chat behavior
│   ├── AGENT.md         # Agent instructions
│   ├── HEARTBEAT.md     # Monitoring behavior
│   ├── JOB_SUMMARY.md   # Summary format
│   ├── TELEGRAM.md      # Telegram prompts
│   ├── CRONS.json       # Your cron jobs
│   └── TRIGGERS.json    # Your webhook triggers
│
└── skills/              # Your custom skills
    └── my-skill/        # Your skill directories
```

## How It Works

When the bot loads configuration:

1. **First** checks `/custom/operating_system/{file}`
2. **Then** falls back to `/operating_system/{file}` if not found

This means:
- ✅ Your customizations in `/custom/` are protected from upstream updates
- ✅ You get new upstream features in `/operating_system/` automatically
- ✅ You can override any default by creating a file in `/custom/`

## Getting Started

### New Users
Run the setup wizard:
```bash
npm run setup
```

The wizard will create your custom configuration files here automatically.

### Existing Users
Use the migration tool to move your current customizations:
```bash
node setup/migrate-to-custom.mjs
```

### Manual Customization
To customize any file:

1. Copy from `/operating_system/` to `/custom/operating_system/`
2. Edit the copy in `/custom/operating_system/`
3. Your version will be used instead of the default

Example:
```bash
cp operating_system/SOUL.md custom/operating_system/SOUL.md
# Edit custom/operating_system/SOUL.md
```

## Updating from Upstream

When you pull updates from thepopebot:

```bash
git fetch upstream
git merge upstream/main
```

Your files in `/custom/` are **automatically protected** by merge strategies. Core functionality gets updated, your customizations stay untouched.

See [UPSTREAM_UPDATES.md](/docs/UPSTREAM_UPDATES.md) for details.
