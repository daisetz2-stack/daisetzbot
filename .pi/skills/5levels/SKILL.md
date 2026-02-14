---
name: 5levels
description: Research and generate bilingual 5-level explanations (English and Japanese) with automated web publishing. Use when user requests "/5levels [keyword]" or asks for multi-level educational content.
---

# 5Levels Research Skill

Generate comprehensive 5-level explanations in both English and Japanese with automated web publishing.

## Overview

This skill creates educational content using the "5 Levels" methodology - explaining concepts at increasing complexity from beginner to expert. Content is researched across both English and Japanese sources and published to a bilingual web interface.

## Usage

When the user types `/5levels [keyword]` in Telegram, create a job that:
1. Researches the topic across English and Japanese sources
2. Generates 5-level explanations in both languages
3. Publishes to the website with proper formatting and citations

## Data Structure

Each topic follows this JSON structure:

```json
{
  "id": "unique-slug",
  "keyword": {
    "en": "English Keyword",
    "ja": "日本語キーワード"
  },
  "created": "2026-02-14T16:00:00Z",
  "colors": {
    "level1": "#E3B341",
    "level2": "#E07A3F",
    "level3": "#C06C84",
    "level4": "#4C78A8",
    "level5": "#2A8F87"
  },
  "levels": {
    "en": [
      {
        "level": 1,
        "title": "Child (Age 5-10)",
        "content": "Simple explanation with everyday examples..."
      },
      {
        "level": 2,
        "title": "Teen (Age 13-17)",
        "content": "More detail with relatable scenarios..."
      },
      {
        "level": 3,
        "title": "Undergraduate Student",
        "content": "Technical concepts with academic context..."
      },
      {
        "level": 4,
        "title": "Graduate Student",
        "content": "Advanced concepts with research context..."
      },
      {
        "level": 5,
        "title": "Expert",
        "content": "Deep dive with unsolved problems and cutting-edge research..."
      }
    ],
    "ja": [
      {
        "level": 1,
        "title": "子ども（5〜10歳）",
        "content": "日常的な例を使ったシンプルな説明..."
      },
      {
        "level": 2,
        "title": "ティーンエイジャー（13〜17歳）",
        "content": "身近なシナリオを使った詳細な説明..."
      },
      {
        "level": 3,
        "title": "大学生",
        "content": "学術的な文脈を持つ技術的な概念..."
      },
      {
        "level": 4,
        "title": "大学院生",
        "content": "研究の文脈を持つ高度な概念..."
      },
      {
        "level": 5,
        "title": "専門家",
        "content": "未解決問題と最先端研究を含む深い考察..."
      }
    ]
  },
  "sources": [
    {
      "title": "Source Title",
      "url": "https://example.com",
      "language": "en"
    }
  ]
}
```

## Research Guidelines

### Sources to Search

**English:**
- Wikipedia (foundational concepts)
- Educational sites (Khan Academy, Coursera, MIT OCW)
- Academic papers (Google Scholar, arXiv)
- News articles (recent developments)
- X/Twitter discourse (current debates)
- Reddit discussions (community perspectives)

**Japanese:**
- Wikipedia日本語版
- Educational sites (NHK高校講座, JMOOC)
- Academic sources (CiNii, J-STAGE)
- News (NHK, Nikkei, Asahi)
- X/Twitter (Japanese discourse)
- はてなブックマーク (community insights)

### Content Requirements

**Level 1 (Child):**
- Use simple everyday language
- Concrete examples from daily life
- No jargon or technical terms
- Focus on "what" not "why"
- 2-3 short paragraphs

**Level 2 (Teen):**
- Add some detail and context
- Relatable scenarios for that age group
- Basic mechanisms explained
- Light introduction to "why"
- 3-4 paragraphs

**Level 3 (Undergraduate):**
- Technical terminology introduced
- Academic frameworks
- Historical context
- Current applications
- 4-5 paragraphs

**Level 4 (Graduate):**
- Advanced concepts and theory
- Research methodologies
- Interdisciplinary connections
- Critical analysis
- 5-6 paragraphs

**Level 5 (Expert):**
- Cutting-edge research
- Unsolved problems
- Debates in the field
- Cultural/regional differences
- Future directions
- 6-8 paragraphs

### Cultural Adaptation

Don't just translate - adapt examples and context:
- **English**: Western examples, US/UK cultural references
- **Japanese**: Japanese examples, local cultural context
- Different metaphors that resonate in each culture
- Region-specific applications and challenges

### Quality Standards

- Each level should be self-contained
- Clear progression in complexity
- Cite 2-3 sources per level minimum
- Include both foundational and recent sources
- Highlight what remains unknown or debated
- Cultural nuance, not direct translation

## Implementation Steps

1. **Research Phase** (15-20 minutes)
   ```bash
   cd /job/.pi/skills/brave-search
   ./search.js "[keyword] basics explanation" -n 10 --content
   ./search.js "[keyword] advanced concepts" -n 10 --content
   ./search.js "[keyword] research current" -n 10 --content --freshness pm
   ./search.js "[キーワード] 説明" -n 10 --content --country JP
   ./search.js "[キーワード] 研究" -n 10 --content --country JP
   ```

2. **Content Generation** (20-30 minutes)
   - Write Level 1-5 in English
   - Write Level 1-5 in Japanese (culturally adapted)
   - Compile sources with proper attribution

3. **Publishing** (5 minutes)
   ```bash
   # Add to data file
   node /job/website/scripts/add-topic.js path/to/topic.json
   
   # Website automatically rebuilds and deploys
   ```

## File Locations

- **Data**: `/job/website/data/topics/[slug].json`
- **Website**: `/job/website/`
- **Scripts**: `/job/website/scripts/`

## Example Workflow

```bash
# User sends: /5levels quantum computing

# 1. Research
cd /job/.pi/skills/brave-search
./search.js "quantum computing basics explanation" -n 10 --content
./search.js "quantum computing applications current" -n 10 --content --freshness pm
./search.js "quantum computing research" -n 10 --content
./search.js "量子コンピューティング 説明" -n 10 --content --country JP
./search.js "量子コンピューティング 研究" -n 10 --content --country JP

# 2. Generate content (see template above)
# Create: /job/website/data/topics/quantum-computing.json

# 3. Verify and commit
git add website/data/topics/quantum-computing.json
git commit -m "Add 5levels: quantum computing"
```

## Tips

- Use Brave Search's `--content` flag to get full article text
- Search in both languages separately - don't just translate queries
- Look for cultural differences in how topics are taught
- Level 5 should include what experts are currently debating
- Include sources from the last month for recent developments
- Balance foundational sources (books, established papers) with recent news
