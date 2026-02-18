Reorganize Skills: Move 5levels to Skills and Rename Academic Research System

Currently there's confusion between two different capabilities:
1. The `/5levels` command in `operating_system/5levels/` that creates progressive explanations (elementary → frontier)
2. The new academic research system in `.pi/skills/5levels/` that does evidence extraction and literature analysis

Both should be skills (capabilities) rather than operating_system configs (agent identity).

REORGANIZATION PLAN:

1. **Move the original 5levels explainer to skills**
   - Move `operating_system/5levels/` → `.pi/skills/5levels-explainer/`
   - Preserve the `/5levels keyword` slash command functionality
   - This generates progressive explanations from elementary to frontier level

2. **Rename the academic research system** 
   - Move `.pi/skills/5levels/` → `.pi/skills/academic-research/`
   - This is the evidence extraction, tension detection, literature synthesis system
   - Keep all the research pipeline functionality intact

3. **Update any cross-references**
   - Fix any file paths or imports that reference the old locations
   - Ensure both skills work independently
   - Update SKILL.md files to reflect new purposes and locations

4. **Consider integration opportunities**
   - The `/5levels` skill could potentially invoke the academic research skill for the "frontier" section
   - Document how they could work together for validated research insights

RESULT:
- Clear separation of concerns: explanation generator vs deep research analysis
- No more name collisions
- Both properly located as reusable capabilities in `.pi/skills/`
- Foundation for potential integration where academic research validates frontier-level explanations

This resolves the confusion and puts each capability in the right architectural layer.