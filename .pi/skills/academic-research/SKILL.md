---
name: academic-research
description: Generate bilingual educational content (English and Japanese) with academic rigor and web publishing. Creates 5-level explanations from child-friendly to expert with cross-cultural adaptation and source citations.
---

# Academic Research - Bilingual Educational Content Generator

Generate comprehensive bilingual educational content using the "5 Levels" methodology with academic sourcing and cultural adaptation.

## Overview

This skill creates educational content that explains concepts at increasing complexity from beginner to expert:
- **Level 1**: Child (Age 5-10)
- **Level 2**: Teen (Age 13-17)
- **Level 3**: Undergraduate Student
- **Level 4**: Graduate Student
- **Level 5**: Expert

Content is researched across both English and Japanese academic and educational sources, culturally adapted (not just translated), and published to a bilingual web interface.

## Key Features

- **Bilingual**: Parallel content in English and Japanese
- **Cultural Adaptation**: Examples and metaphors tailored to each culture
- **Academic Sourcing**: Wikipedia, papers (arXiv, J-STAGE), educational sites
- **Progressive Complexity**: Each level builds on the previous
- **Web Publishing**: Automated deployment to website

## Usage

When generating educational content on a topic:

1. **Research Phase** (15-20 minutes)
   - Search English sources (Wikipedia, Google Scholar, arXiv, news)
   - Search Japanese sources (Wikipedia日本語版, CiNii, J-STAGE, NHK)
   - Use brave-search skill with `--content` flag

2. **Content Generation** (20-30 minutes)
   - Write 5 levels in English (child → expert)
   - Write 5 levels in Japanese (culturally adapted)
   - Compile sources with proper attribution

3. **Publishing** (5 minutes)
   - Create JSON file following the data structure
   - Save to: `website/data/topics/[slug].json`
   - Commit and push (website auto-rebuilds)

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

## Research Sources

### English Sources
- Wikipedia (foundational concepts)
- Academic papers (Google Scholar, arXiv)
- Educational sites (Khan Academy, Coursera, MIT OCW)
- News articles (recent developments)
- X/Twitter (current debates)
- Reddit (community perspectives)

### Japanese Sources
- Wikipedia日本語版
- Academic sources (CiNii, J-STAGE)
- Educational sites (NHK高校講座, JMOOC)
- News (NHK, Nikkei, Asahi)
- X/Twitter (Japanese discourse)
- はてなブックマーク (community insights)

## Content Requirements by Level

### Level 1 (Child)
- Simple everyday language
- Concrete examples from daily life
- No jargon or technical terms
- Focus on "what" not "why"
- 2-3 short paragraphs

### Level 2 (Teen)
- Add detail and context
- Relatable scenarios
- Basic mechanisms explained
- Light introduction to "why"
- 3-4 paragraphs

### Level 3 (Undergraduate)
- Technical terminology introduced
- Academic frameworks
- Historical context
- Current applications
- 4-5 paragraphs

### Level 4 (Graduate)
- Advanced concepts and theory
- Research methodologies
- Interdisciplinary connections
- Critical analysis
- 5-6 paragraphs

### Level 5 (Expert)
- Cutting-edge research
- Unsolved problems
- Debates in the field
- Cultural/regional differences
- Future directions
- 6-8 paragraphs

## Cultural Adaptation

**Don't just translate - adapt examples and context:**
- **English**: Western examples, US/UK cultural references
- **Japanese**: Japanese examples, local cultural context
- Different metaphors that resonate in each culture
- Region-specific applications and challenges

## Quality Standards

- Each level should be self-contained
- Clear progression in complexity
- Cite 2-3 sources per level minimum
- Include both foundational and recent sources
- Highlight what remains unknown or debated
- Cultural nuance, not direct translation

## Example Research Workflow

```bash
# Research English sources
cd /job/.pi/skills/brave-search
./search.js "quantum computing basics explanation" -n 10 --content
./search.js "quantum computing advanced concepts" -n 10 --content
./search.js "quantum computing research current" -n 10 --content --freshness pm

# Research Japanese sources
./search.js "量子コンピューティング 説明" -n 10 --content --country JP
./search.js "量子コンピューティング 研究" -n 10 --content --country JP
./search.js "量子コンピューティング 最新" -n 10 --content --country JP --freshness pm

# Generate JSON following data structure above
# Save to: website/data/topics/quantum-computing.json

# Commit
git add website/data/topics/quantum-computing.json
git commit -m "Add academic content: quantum computing (EN/JA)"
```

## File Locations

- **Output**: `website/data/topics/[slug].json`
- **Website**: `website/`
- **Scripts**: `website/scripts/`

## Integration

This skill integrates with:
- **brave-search**: For multilingual web research
- **Website**: Automated publishing via Git commit
- **Telegram**: For command triggers and notifications

## Tips

- Use Brave Search's `--content` flag for full article text
- Search in both languages separately - don't just translate queries
- Look for cultural differences in how topics are taught
- Level 5 should include what experts are currently debating
- Include sources from the last month for recent developments
- Balance foundational sources with recent research
- Verify technical terms have accurate Japanese translations
- Test examples resonate in target culture

## Duration

- Research: 15-20 minutes
- Content generation: 20-30 minutes  
- Publishing: 5 minutes
- **Total: 40-55 minutes**
