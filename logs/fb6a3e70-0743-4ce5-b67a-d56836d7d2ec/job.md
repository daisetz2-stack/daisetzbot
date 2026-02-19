Change agent name from "thepopebot" to "daisetz"

1. Scan the entire codebase for all references to "thepopebot" (case-insensitive)
2. Update identity and personality files:
   - `operating_system/SOUL.md` - Change name and any self-references
   - `operating_system/CHATBOT.md` - Update chat behavior and name references
   - `operating_system/JOB_SUMMARY.md` - Update any name references in job summaries
3. Update documentation:
   - `README.md` - Change project name and references
   - Any other documentation files that reference the name
4. Update code comments and log messages that reference the name
5. Be careful to preserve:
   - GitHub repository names in URLs/paths (keep as-is for upstream compatibility)
   - Docker image references that need to stay functional
   - Any technical identifiers that aren't meant to be user-facing names
6. Test that the change doesn't break:
   - Telegram chat functionality
   - Job creation and execution
   - GitHub Actions workflows
7. Commit all changes with an appropriate message

The goal is to make "daisetz" your conversational identity while keeping all the technical plumbing intact for updates and functionality.