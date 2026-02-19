# 5 Levels Research System - Integration Guide

## What Was Built

A complete research agent system that enables daisetz to conduct comprehensive, multi-level research on any topic through the `/5levels [keyword]` command.

### Created Files

1. **`5levels_research.md`** (12KB)
   - Complete research methodology
   - Progressive 5-level framework
   - Web research strategies
   - Quality assurance guidelines

2. **`5levels_report_template.md`** (19KB)
   - Comprehensive report structure
   - Section-by-section templates
   - Formatting standards
   - Metadata requirements

3. **`5levels_report.md`** (79KB)
   - Full example report on "Neural Networks"
   - Demonstrates expected quality
   - Shows proper sourcing and structure
   - 12,500+ words, 42 sources

4. **`README.md`** (11KB)
   - System documentation
   - Integration options
   - Troubleshooting guide
   - Best practices

5. **`INTEGRATION_GUIDE.md`** (this file)
   - Step-by-step setup
   - Configuration examples
   - Testing procedures

## Prerequisites

Before integrating the 5 Levels system, ensure:

- [x] daisetz is operational
- [x] brave-search skill is installed and configured
- [x] BRAVE_API_KEY is set in LLM_SECRETS
- [x] Event handler is running
- [x] GitHub Actions workflows are functional

## Integration Steps

### Step 1: Configure Brave Search API

The research system requires the brave-search skill for web research.

**Check if brave-search skill exists:**
```bash
ls -la .pi/skills/brave-search/
```

**If not present, add to LLM_SECRETS:**
```json
{
  "BRAVE_API_KEY": "your-brave-api-key-here"
}
```

Get a Brave Search API key at: https://brave.com/search/api/

**Encode and set as GitHub secret:**
```bash
# Combine with existing LLM_SECRETS
echo -n '{"BRAVE_API_KEY":"your-key"}' | base64
```

Add to GitHub Secrets → `LLM_SECRETS`

### Step 2: Update Chatbot System Prompt (Recommended)

Add `/5levels` command support to `operating_system/CHATBOT.md`:

```markdown
## Available Commands

### /5levels [keyword]
Conduct comprehensive multi-level research on any topic.

**Usage:** `/5levels quantum computing`

**What it does:**
- Performs progressive research from foundation to cutting-edge
- Generates a detailed report with 40+ sources
- Takes ~60-90 minutes to complete
- Saves report to logs directory

**When to use:**
- User wants deep understanding of a topic
- Research needed for decision-making
- Learning about complex subjects
- Exploring new domains

**How to respond:**
1. Acknowledge the research request
2. Explain it will take 60-90 minutes
3. Create the research job using create_job tool:
   - Task: "Read the file at .pi/skills/5levels-explainer/5levels_research.md and conduct comprehensive 5-level research on: [keyword]"
4. Tell user they'll be notified when complete
5. Provide preview of what the report will cover (5 levels)
```

### Step 3: Test the System

#### Manual Test (via Job Creation)

Create a test job manually to verify the system works:

**Create test job branch:**
```bash
# From event handler or local environment
curl -X POST https://your-bot-url.com/webhook \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "job": "Read the file at .pi/skills/5levels-explainer/5levels_research.md and conduct comprehensive 5-level research on: photosynthesis"
  }'
```

**Expected behavior:**
1. Job branch created: `job/[uuid]`
2. Docker agent runs with Pi
3. Agent reads research methodology
4. Conducts 5-level research using brave-search
5. Generates report using template
6. Saves to `logs/[JOB_ID]/5levels_report.md`
7. Commits and creates PR
8. Auto-merge (if configured)
9. Notification sent

**Verify:**
```bash
# Check logs directory
ls -la logs/[JOB_ID]/

# Should contain:
# - job.md (original task)
# - 5levels_report.md (generated report)
# - session logs
```

#### Telegram Test (via Chat)

If Telegram is configured:

1. Send to bot: `/5levels photosynthesis`
2. Bot should respond: "Starting 5-level research on 'photosynthesis'..."
3. Wait 60-90 minutes
4. Receive notification with summary
5. Access full report in logs directory

### Step 4: Optional - Add Webhook Trigger

For external integrations, add to `operating_system/TRIGGERS.json`:

```json
{
  "name": "5levels-webhook",
  "watch_path": "/webhook",
  "actions": [
    {
      "type": "agent",
      "job": "Read the file at .pi/skills/5levels-explainer/5levels_research.md and conduct comprehensive 5-level research on: {{body.keyword}}"
    }
  ],
  "enabled": true
}
```

**Usage:**
```bash
curl -X POST https://your-bot-url.com/webhook \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"keyword": "blockchain technology"}'
```

### Step 5: Optional - Add Scheduled Research

For periodic research on trending topics, add to `operating_system/CRONS.json`:

```json
{
  "name": "weekly-tech-research",
  "schedule": "0 9 * * 1",
  "type": "agent",
  "job": "Read the file at .pi/skills/5levels-explainer/5levels_research.md. First, use brave-search to find the top trending technology topic this week. Then conduct comprehensive 5-level research on that topic.",
  "enabled": true
}
```

## Configuration Examples

### Minimal Configuration (Telegram Only)

Update `CHATBOT.md` with `/5levels` command support. Users trigger via chat.

**Pros:** Simple, intuitive user experience
**Cons:** Only available through Telegram

### Full Configuration (All Methods)

Enable all three trigger methods:
1. Telegram chat commands
2. Direct webhook API
3. Scheduled cron jobs

**Pros:** Maximum flexibility, supports automation
**Cons:** More complex, more attack surface

### Domain-Specific Configuration

Create specialized research variants:

**File:** `.pi/skills/5levels-explainer/5levels_research_scientific.md`
- Emphasizes peer-reviewed sources
- Requires more Level 3 technical depth
- Includes statistical analysis requirements

**File:** `.pi/skills/5levels-explainer/5levels_research_market.md`
- Focuses on market data, trends, competitors
- Includes financial metrics
- Emphasizes Level 4 business applications

**Trigger:**
```json
{
  "name": "scientific-research",
  "watch_path": "/webhook",
  "actions": [{
    "type": "agent",
    "job": "Read .pi/skills/5levels-explainer/5levels_research_scientific.md and research: {{body.keyword}}"
  }]
}
```

## Monitoring and Maintenance

### Success Metrics

Track these indicators for system health:

1. **Completion Rate:** % of research jobs that finish successfully
2. **Report Quality:** Average word count, source count, comprehensiveness
3. **User Satisfaction:** Feedback on report usefulness
4. **Duration:** Average time per research job
5. **API Usage:** Brave Search API calls per job

### Common Issues and Solutions

#### Issue: Research Takes Too Long (>2 hours)

**Causes:**
- API rate limiting
- Network timeouts
- Too many sources being gathered

**Solutions:**
- Adjust source requirements in `5levels_research.md`
- Implement caching for repeated searches
- Reduce depth at Level 3 or 5

#### Issue: Low-Quality Reports

**Causes:**
- Poor search queries
- Limited source availability
- Agent not following methodology

**Solutions:**
- Refine query patterns in methodology
- Add more specific research objectives
- Test with better-documented topics first
- Review session logs to identify where agent struggled

#### Issue: Missing Sources

**Causes:**
- Agent not documenting during research
- Brave Search API issues
- Methodology not emphasizing citations

**Solutions:**
- Add explicit source tracking requirements
- Include citation examples in methodology
- Require inline citations, not just bibliography

#### Issue: Research Scope Too Narrow/Broad

**Causes:**
- Ambiguous keywords
- Methodology not providing enough guidance

**Solutions:**
- Encourage users to be more specific with keywords
- Add keyword refinement step in methodology
- Create domain-specific variants

### Log Review

Regularly review research session logs:

```bash
# Find recent 5levels jobs
find logs/ -name "job.md" -exec grep -l "5levels_research" {} \;

# Review a specific session
cat logs/[JOB_ID]/session-*.jsonl | jq '.content'
```

Look for:
- Search query effectiveness
- Time spent per level
- Sources found vs. used
- Error messages or retries
- Quality of synthesis

## Advanced Usage

### Comparative Research

Create jobs that compare multiple topics:

```
Read .pi/skills/5levels-explainer/5levels_research.md and conduct comparative 5-level research on: "quantum computing" vs "classical supercomputing". At each level, compare and contrast the two approaches. Generate a single report with side-by-side analysis.
```

### Deep Dive on Specific Aspects

Target research at specific levels:

```
Read .pi/skills/5levels-explainer/5levels_research.md. Focus especially on Level 4 (Applications & Impact) and Level 5 (Future Directions) for: "artificial general intelligence". Provide standard coverage for Levels 1-3, but exceptional depth for Levels 4-5.
```

### Continuous Research Series

Set up cron jobs for ongoing research series:

```json
{
  "name": "ai-research-series",
  "schedule": "0 10 * * 3",
  "type": "agent",
  "job": "This is part of an ongoing AI research series. Read .pi/skills/5levels-explainer/5levels_research.md and research the next topic in this list: [transformer architectures, diffusion models, reinforcement learning from human feedback, mechanistic interpretability, AI alignment]. Check which topics have been completed in logs/ and research the next one.",
  "enabled": true
}
```

### Integration with Other Skills

Combine with other daisetz capabilities:

```
Read .pi/skills/5levels-explainer/5levels_research.md and conduct 5-level research on: "renewable energy storage". After completing the report, use the research findings to draft a blog post explaining the topic to a general audience. Save both the detailed report and the blog post.
```

## Customization Guide

### Adjusting Research Depth

Edit `5levels_research.md`:

**For faster research (30-45 min):**
- Reduce minimum sources per level (3 → 2)
- Decrease time allocation per level
- Focus on overview sources vs. deep papers

**For deeper research (2-3 hours):**
- Increase minimum sources per level (5 → 8)
- Add requirement for academic papers at Level 3
- Require expert interviews or opinions at Level 5
- Add quantitative analysis requirements

### Custom Report Formats

Edit `5levels_report_template.md`:

**For executive summaries:**
- Add "Executive Summary" section at top
- Include "Key Takeaways" boxes throughout
- Add TL;DR for each level

**For technical audiences:**
- Expand Level 3 depth
- Add code examples or mathematical derivations
- Include benchmark comparisons
- Link to GitHub repos or APIs

**For visual learners:**
- Add ASCII diagrams in template
- Require textual descriptions of visualizations
- Include timeline formats
- Use tables more extensively

### Domain Templates

Create specialized templates for different domains:

**`5levels_report_template_scientific.md`:**
- Add "Experimental Methods" section
- Include "Statistical Significance" assessments
- Require DOI links for papers
- Add "Reproducibility" notes

**`5levels_report_template_business.md`:**
- Add "Market Size & Growth" section
- Include "Competitive Landscape" analysis
- Add "Investment & Funding" overview
- Include "Risk Assessment"

**`5levels_report_template_historical.md`:**
- Add "Primary Sources" section
- Include "Historiographical Debates"
- Add "Contemporary Context"
- Include timeline visualization requirements

## Performance Optimization

### Caching Strategy

Implement caching to speed up repeated research:

1. Cache Brave Search results by query
2. Store common topic foundations (Level 1)
3. Reuse source lists for related topics
4. Cache processed source content

**Implementation:** Add caching logic to brave-search skill or create wrapper skill

### Parallel Research

For topics with independent subtopics, research levels in parallel:

```
Research these three aspects of "climate change" in parallel:
- Physical science basis (5 levels)
- Economic impacts (5 levels)  
- Policy responses (5 levels)

Then synthesize into a unified report.
```

**Note:** Requires careful resource management to avoid API rate limits

### Progressive Delivery

For long research jobs, deliver interim results:

1. Send Level 1 summary after 10 minutes
2. Send Levels 1-2 after 20 minutes
3. Send Levels 1-3 after 40 minutes
4. Send complete report after 90 minutes

**Implementation:** Requires event handler modifications to support partial reports

## Testing Checklist

Before deploying to production:

- [ ] Brave Search API key is configured and working
- [ ] Test research on 3 different topic types:
  - [ ] Technical topic (e.g., "machine learning")
  - [ ] Scientific topic (e.g., "CRISPR")
  - [ ] Social topic (e.g., "remote work")
- [ ] Verify report structure matches template
- [ ] Check source count (30+ sources minimum)
- [ ] Verify inline citations are present
- [ ] Test Telegram command integration
- [ ] Test webhook trigger (if enabled)
- [ ] Verify auto-merge works correctly
- [ ] Check notification system
- [ ] Review session logs for errors
- [ ] Verify report is saved in logs directory
- [ ] Test with obscure topic (limited sources available)
- [ ] Test with very popular topic (many sources available)

## Rollout Plan

### Phase 1: Internal Testing (Week 1)
- Deploy to staging environment
- Test with team members
- Research 5-10 diverse topics
- Gather feedback on quality
- Iterate on methodology

### Phase 2: Beta Users (Week 2-3)
- Invite select users to test
- Limit to specific topic areas
- Closely monitor results
- Collect user feedback
- Refine based on learnings

### Phase 3: General Availability (Week 4+)
- Open to all users
- Announce via Telegram/email
- Provide usage examples
- Monitor metrics
- Iterate continuously

## Support and Documentation

### User Documentation

Create user-facing docs explaining:
- What 5 Levels research provides
- How to use the `/5levels` command
- What to expect (time, format)
- How to interpret reports
- Best practices for keywords

### Developer Documentation

Maintain technical docs covering:
- Architecture and data flow
- Configuration options
- Customization guide
- Troubleshooting
- Performance optimization

### Example Topics for Testing

Good test topics (well-documented, clear scope):
- Machine Learning
- Solar Panels
- Blockchain
- Gene Editing
- Electric Vehicles
- Quantum Computing
- Remote Work
- Vertical Farming

Challenging test topics (emerging, ambiguous, or limited info):
- AGI Alignment
- Bioelectric Medicine
- Quantum Supremacy
- Post-Scarcity Economics
- Longevity Escape Velocity

## Next Steps

1. **Complete integration** following this guide
2. **Run initial tests** with known topics
3. **Review outputs** for quality
4. **Iterate on methodology** as needed
5. **Deploy to users** gradually
6. **Monitor and improve** continuously

## Conclusion

The 5 Levels Research System provides daisetz with powerful autonomous research capabilities. By following this integration guide, you can enable comprehensive research on any topic, delivered through flexible trigger mechanisms (chat, webhook, cron).

The system is designed to be:
- **Comprehensive:** Progressive depth from basics to cutting-edge
- **Flexible:** Customizable for different domains and use cases
- **Autonomous:** Requires no human intervention during research
- **Well-documented:** Reports include extensive sourcing
- **Extensible:** Easy to adapt methodology and templates

For questions, issues, or enhancements, refer to the README.md and the example report, or review session logs to understand the agent's research process.

---

**System Status:** ✅ Ready for Integration

**Required Next Step:** Configure Brave Search API key in LLM_SECRETS

**Estimated Time to Production:** 1-2 hours (setup + testing)
