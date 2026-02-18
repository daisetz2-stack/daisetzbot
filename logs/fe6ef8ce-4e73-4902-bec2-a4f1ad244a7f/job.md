Remove the old `operating_system/academic_research/` folder and its contents, since we now have a proper skill implementation in `.pi/skills/academic-research/` with the `/academic_research` slash command. This cleanup will prevent conflicts between the old and new versions of the academic research functionality.

The job should:
1. Delete the entire `operating_system/academic_research/` directory
2. Verify that `.pi/skills/academic-research/` is still intact and working
3. Check if there are any references to the old folder in other files that need updating