Restructure thepopebot to support clean upstream updates while preserving customization capabilities. This job will:

1. **Analyze Current Structure** - Map all customizable vs core files in the existing thepopebot codebase

2. **Design New Architecture** - Create a separation between:
   - Core thepopebot files (updated from upstream) 
   - Custom user files (personality, skills, configs) in protected paths
   - Wrapper/integration layer to combine both

3. **Implement Repository Restructure**:
   - Move customizable content to new protected paths (e.g. `custom/`)
   - Update Dockerfile and entrypoint.sh to load from both core and custom paths
   - Modify GitHub workflows to handle the new structure
   - Update Event Handler to load configs from custom paths

4. **Set Up Git Integration**:
   - Configure upstream remote for thepopebot main repo
   - Add .gitattributes or merge strategies for clean updates
   - Test merge workflow with current thepopebot main

5. **Create Migration Tools**:
   - Scripts to migrate existing customizations to new structure
   - Documentation for the new update workflow
   - Validation that all functionality works after restructure

6. **Document New Workflow** - Clear instructions for:
   - How to customize the bot in the new structure
   - How to pull upstream updates cleanly
   - What files are safe to modify vs should stay as-is

The goal is maintaining full customization power while making `git merge upstream/main` a smooth, conflict-free operation for core updates.