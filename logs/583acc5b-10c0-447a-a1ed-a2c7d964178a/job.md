Create a research agent system for the /5levels slash command that performs comprehensive multi-level research on any given keyword or topic.

**Requirements:**

1. **Create folder structure:**
   - Create `operating_system/5levels/` directory
   - Organize all related files in this folder

2. **Create core files:**
   - `operating_system/5levels/5levels_research.md` - Defines the research methodology and process the bot follows when receiving a /5levels command with a keyword
   - `operating_system/5levels/5levels_report_template.md` - Defines the structure and format of the 5 Levels research report
   - `operating_system/5levels/5levels_report.md` - The actual generated report (placeholder/example initially)

3. **Research methodology:**
   - Design a 5-level research approach that progressively deepens understanding of any given topic/keyword
   - Each level should build upon the previous level's findings
   - Include web research, analysis, synthesis, and actionable insights

4. **Integration requirements:**
   - Design the system to work with thepopebot's existing slash command infrastructure
   - Ensure the research process can be triggered via `/5levels [keyword]` command
   - Structure the files so they can be referenced by job descriptions or trigger actions

5. **Report output:**
   - Define a comprehensive report template that presents findings in a clear, structured format
   - Include sections for each research level, key insights, sources, and recommendations
   - Make the template reusable for any research topic

The system should be ready to integrate with thepopebot's trigger system to automatically perform 5-level research when users send the `/5levels` command with a keyword.