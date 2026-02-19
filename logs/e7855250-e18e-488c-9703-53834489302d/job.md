Implement automatic upstream update checking for thepopebot with the following features:

1. **Create Upstream Update Cron Job** - Add a scheduled task to CRONS.json that:
   - Runs daily (configurable schedule)
   - Checks for new commits on thepopebot upstream repo
   - Only triggers when actual updates are available

2. **Build Update Detection Logic** - Create a command-type cron that:
   - Fetches latest upstream commits via GitHub API
   - Compares with local tracking (store last processed commit hash)
   - Avoids duplicate notifications for the same updates

3. **Implement Safe Update Process** - When updates are found:
   - Create an agent job to merge upstream changes
   - Generate a PR with the upstream updates
   - Include summary of what changed in the PR description
   - Send Telegram notification with update details

4. **Add Update Management Commands** - Create skills/tools for:
   - Manual update checks ("check for upstream updates")
   - Configuring update frequency 
   - Pausing/resuming automatic checks
   - Viewing update history

5. **Error Handling & Rollback** - Handle edge cases:
   - Merge conflicts (create PR but don't auto-merge)
   - Failed updates (notify and preserve current state)
   - Network issues (retry logic)

6. **Documentation** - Update docs with:
   - How the automatic update system works
   - How to configure update frequency
   - How to handle merge conflicts when they occur
   - How to disable auto-updates if needed

The goal is hands-off upstream synchronization with safety controls - you get notified when updates are ready, can review the changes, then approve the merge.