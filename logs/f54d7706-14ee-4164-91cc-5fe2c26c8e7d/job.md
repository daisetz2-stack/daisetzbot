Reorganize Skills: Clean Separation of 5levels Explainer and Academic Research (Fresh Start)

The previous reorganization job has conflicts because a PR was merged after it started. Starting fresh with current main branch state.

CURRENT STATE AFTER MERGE:
- `operating_system/5levels/` - Original 5levels explainer with `/5levels keyword` command
- `.pi/skills/5levels/` - Updated academic research system (evidence extraction, literature synthesis)

REORGANIZATION NEEDED:

1. **Move the 5levels explainer to skills**
   - Move `operating_system/5levels/` → `.pi/skills/5levels-explainer/`  
   - This is the system that creates progressive explanations (elementary → frontier level)
   - Preserve the `/5levels keyword` slash command functionality
   - Update any references to reflect the new location

2. **Rename the academic research system**
   - Move `.pi/skills/5levels/` → `.pi/skills/academic-research/`
   - This is the evidence extraction, tension detection, research pipeline system
   - Keep all the updated research functionality intact
   - Update SKILL.md and any internal references

3. **Clean up any remaining references**
   - Ensure both skills work independently in their new locations
   - Update documentation to reflect the separation of concerns
   - Remove any now-empty directories

4. **Verify functionality**
   - Both skills should be discoverable in their new locations
   - No name conflicts or path issues
   - Clear distinction between explanation generation vs deep research analysis

RESULT: Clean architectural separation with `/5levels-explainer` for progressive explanations and `academic-research` for literature analysis, properly positioned as reusable skills.