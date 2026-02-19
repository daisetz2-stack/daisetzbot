# 5 Levels Research System - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    5 Levels Research Agent System                    │
│                         (thepopebot extension)                       │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         TRIGGER LAYER                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │   Telegram     │    │   Webhook    │    │   Cron Schedule  │   │
│  │   /5levels     │    │   API POST   │    │   Automated      │   │
│  │   [keyword]    │    │   {keyword}  │    │   Research       │   │
│  └───────┬────────┘    └──────┬───────┘    └────────┬─────────┘   │
│          │                    │                      │              │
│          └────────────────────┴──────────────────────┘              │
│                               ▼                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                      JOB CREATION LAYER                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Task: "Read .pi/skills/5levels-explainer/5levels_research.md           │
│         and conduct comprehensive 5-level research on: [keyword]"   │
│                                                                      │
│  Creates:  job/[uuid] branch                                        │
│            logs/[JOB_ID]/job.md                                     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     DOCKER AGENT LAYER                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Pi Coding Agent                                           │    │
│  │  ├─ Read: 5levels_research.md (methodology)               │    │
│  │  ├─ Read: 5levels_report_template.md (structure)          │    │
│  │  └─ Execute: 5-level research process                     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                               ▼                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                     RESEARCH EXECUTION                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Level 1: Foundation & Overview (5-10 min)                          │
│  ├─ brave-search: "what is [keyword]"                               │
│  ├─ brave-search: "[keyword] explained"                             │
│  ├─ Synthesis: Simple definition, why it matters, basic facts       │
│  └─ Output: Foundation section                                      │
│                                                                      │
│  Level 2: Core Concepts & Components (10-15 min)                    │
│  ├─ brave-search: "how [keyword] works"                             │
│  ├─ brave-search: "history of [keyword]"                            │
│  ├─ Synthesis: Components, principles, key figures                  │
│  └─ Output: Core concepts section                                   │
│                                                                      │
│  Level 3: Deep Dive & Technical Details (15-20 min)                 │
│  ├─ brave-search: "[keyword] technical details"                     │
│  ├─ brave-search: "[keyword] research data"                         │
│  ├─ Synthesis: Mechanisms, data, specifications                     │
│  └─ Output: Technical section                                       │
│                                                                      │
│  Level 4: Applications & Impact (15-20 min)                         │
│  ├─ brave-search: "[keyword] applications"                          │
│  ├─ brave-search: "[keyword] challenges"                            │
│  ├─ Synthesis: Use cases, impact, limitations, case studies         │
│  └─ Output: Applications section                                    │
│                                                                      │
│  Level 5: Advanced Perspectives (10-15 min)                         │
│  ├─ brave-search: "future of [keyword]"                             │
│  ├─ brave-search: "[keyword] latest research"                       │
│  ├─ Synthesis: Trends, debates, predictions, frontier research      │
│  └─ Output: Advanced section                                        │
│                                                                      │
│  Report Generation (10-15 min)                                      │
│  ├─ Apply 5levels_report_template.md structure                      │
│  ├─ Format all sections with markdown                               │
│  ├─ Add executive summary and cross-level insights                  │
│  ├─ Compile comprehensive source list                               │
│  └─ Save: logs/[JOB_ID]/5levels_report.md                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       OUTPUT & DELIVERY                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. Commit to job branch:                                           │
│     └─ logs/[JOB_ID]/5levels_report.md                             │
│                                                                      │
│  2. Create Pull Request                                             │
│     └─ Title: "Research: [keyword]"                                 │
│                                                                      │
│  3. Auto-merge (if enabled)                                         │
│     └─ Merge to main branch                                         │
│                                                                      │
│  4. Notification                                                    │
│     └─ Telegram/webhook with summary                                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Input → Processing → Output

```
Keyword
   ↓
5levels_research.md (methodology) ──→ Research Process
   ↓                                        ↓
brave-search skill (web research) ←────────┘
   ↓
Raw Information (30-50+ sources)
   ↓
5levels_report_template.md (structure) ──→ Synthesis
   ↓
Formatted Report (8,000-15,000 words)
   ↓
logs/[JOB_ID]/5levels_report.md
```

---

## Component Interactions

### 1. Trigger → Job Creation

```
User/System → Trigger (chat/API/cron)
              ↓
         Event Handler
              ↓
      GitHub API (create branch)
              ↓
      job/[uuid] branch created
              ↓
   logs/[JOB_ID]/job.md written
```

### 2. Job Execution

```
GitHub Actions (run-job.yml)
         ↓
   Docker Agent Launch
         ↓
   Pi Coding Agent
         ↓
   Read: 5levels_research.md
         ↓
   Execute Research Methodology
         ├─ brave-search queries
         ├─ Information gathering
         ├─ Source verification
         └─ Progressive synthesis
         ↓
   Read: 5levels_report_template.md
         ↓
   Generate Formatted Report
         ↓
   Write: logs/[JOB_ID]/5levels_report.md
```

### 3. Completion & Delivery

```
Agent Commits Changes
         ↓
   Create Pull Request
         ↓
   Auto-merge Workflow
         ↓
   Update Event Handler
         ↓
   Send Notification
         ↓
   User Receives Summary
```

---

## File Dependencies

```
5levels_research.md
  ↓ (defines process)
  ├─→ brave-search skill (web research tool)
  ├─→ Pi agent (executor)
  └─→ 5levels_report_template.md (output format)
         ↓
    5levels_report.md (generated output)
```

---

## Integration Points

### Input Integration Points

1. **Telegram Bot**
   - Path: `/telegram/webhook`
   - Handler: `event_handler/claude/tools.js` (create_job)
   - Trigger: `/5levels [keyword]` command

2. **Webhook API**
   - Path: `/webhook`
   - Handler: `event_handler/triggers.js`
   - Body: `{"keyword": "..."}`

3. **Cron Scheduler**
   - Config: `operating_system/CRONS.json`
   - Handler: `event_handler/cron.js`
   - Schedule: Any valid cron expression

### Output Integration Points

1. **GitHub Repository**
   - Location: `logs/[JOB_ID]/5levels_report.md`
   - Committed to main branch (after PR merge)

2. **Notification System**
   - Telegram: Message with summary
   - Webhook: POST to configured URL
   - Event Handler: GitHub Actions callback

---

## Scalability Considerations

### Concurrent Research Jobs

```
Multiple Keywords → Multiple Jobs
                         ↓
              Parallel Execution
                         ↓
         (Each in isolated container)
                         ↓
           Separate PR per job
                         ↓
          Sequential auto-merge
```

### Resource Usage

| Resource | Per Job | Concurrent Limit |
|----------|---------|------------------|
| **Duration** | 60-90 min | Based on GitHub Actions |
| **Memory** | ~2 GB | Container allocation |
| **API Calls** | 50-100 (Brave) | Rate limit dependent |
| **Storage** | ~100 KB per report | Git repository |
| **Compute** | 1 CPU core | Container allocation |

---

## Error Handling

```
Trigger → Job Creation
            ↓
       [Error?] → Log + Notify User
            ↓ No
     Docker Agent
            ↓
  Research Execution
            ↓
  [Level Fails?] → Retry (3x) → [Still Fails?] → Partial Report
            ↓ No                                        ↓
     Report Generation                            Mark incomplete
            ↓
       PR Creation
            ↓
     [Merge Fails?] → Manual Review Required
            ↓ No
    Auto-merge Success
            ↓
      Notification
```

---

## Security Model

### Credential Flow

```
SECRETS (GitHub Secret)
   ↓ base64 encoded
Docker Agent Environment
   ↓ decoded
BRAVE_API_KEY (in LLM_SECRETS)
   ↓ accessible to agent
brave-search skill
   ↓ makes API calls
Brave Search API
```

### Access Control

- **Event Handler:** Requires `API_KEY` for webhook
- **GitHub Actions:** Uses `GITHUB_TOKEN` (automatic)
- **Brave API:** Key stored in `LLM_SECRETS` (agent-accessible)
- **Output:** Committed to repository (access per repo permissions)

---

## Performance Optimization

### Caching Opportunities

1. **Search Results:** Cache by query hash
2. **Source Content:** Cache processed sources
3. **Common Topics:** Cache Level 1 for popular keywords
4. **Templates:** Pre-compile markdown structure

### Parallelization

- Level 1-2 research (independent concepts)
- Multiple source fetches per level
- Cross-verification queries

### Cost Optimization

- Reuse search results for related queries
- Batch API calls where possible
- Progressive result delivery (early exit if sufficient)

---

## Monitoring Points

```
┌─────────────────────────────────────────────────────────┐
│  Metric Collection Points                               │
├─────────────────────────────────────────────────────────┤
│  1. Trigger received                                    │
│  2. Job created (branch + job.md)                       │
│  3. Agent started                                       │
│  4. Each level completed (1-5)                          │
│  5. Report generated                                    │
│  6. PR created                                          │
│  7. Auto-merge completed                                │
│  8. Notification sent                                   │
│  9. Total duration                                      │
│ 10. API calls made                                      │
│ 11. Sources gathered                                    │
│ 12. Report word count                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Extension Points

### Custom Research Types

```
5levels_research.md (default)
  ├─ 5levels_research_scientific.md (more academic)
  ├─ 5levels_research_business.md (market focus)
  ├─ 5levels_research_technical.md (deep technical)
  └─ 5levels_research_historical.md (timeline focus)
```

### Custom Report Formats

```
5levels_report_template.md (default)
  ├─ 5levels_report_template_brief.md (executive)
  ├─ 5levels_report_template_academic.md (paper style)
  ├─ 5levels_report_template_blog.md (public content)
  └─ 5levels_report_template_comparison.md (A vs B)
```

### Additional Skills Integration

```
brave-search (web research)
  ├─ academic-search (scholarly articles)
  ├─ news-search (recent news)
  ├─ video-search (video content)
  └─ image-search (visual content)
```

---

## Architecture Principles

1. **Separation of Concerns**
   - Methodology (what to research) separate from template (how to format)
   - Triggers separate from execution
   - Research separate from delivery

2. **Progressive Enhancement**
   - Each level builds on previous
   - Can stop early if needed (partial results)
   - Graceful degradation if sources limited

3. **Extensibility**
   - Easy to add new research types
   - Custom templates for different outputs
   - Additional skills can be integrated

4. **Autonomy**
   - No human intervention required
   - Self-directed research process
   - Automatic quality checks

5. **Observability**
   - Session logs capture full process
   - Metrics at each stage
   - Reports include metadata

---

## System Boundaries

### What This System Does

✅ Autonomous multi-level research  
✅ Web search and information gathering  
✅ Source verification and synthesis  
✅ Professional report generation  
✅ Markdown formatting  
✅ Git integration and PR creation  

### What This System Does NOT Do

❌ Human expert interviews (uses published opinions)  
❌ Paywall content access (uses free sources)  
❌ Real-time data collection (uses published data)  
❌ Image/video generation (text-only reports)  
❌ Interactive visualizations (static markdown)  
❌ Fact-checking external content (focuses on research task)  

---

## Future Architecture Considerations

### Potential Enhancements

1. **Distributed Research**
   - Multiple agents research different levels in parallel
   - Aggregate results at end

2. **Incremental Delivery**
   - Stream results as levels complete
   - Progressive report updates

3. **Caching Layer**
   - Redis for search result caching
   - Source content CDN

4. **Quality Scoring**
   - ML model to assess report quality
   - Automatic retry if quality low

5. **Multi-modal Integration**
   - Image generation for diagrams
   - Video summarization
   - Audio research (podcasts, interviews)

---

**Architecture Version:** 1.0  
**Last Updated:** 2024-02-18  
**Status:** Production Ready
