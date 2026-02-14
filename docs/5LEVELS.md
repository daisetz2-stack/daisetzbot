# 5Levels System Documentation

The `/5levels` command system provides bilingual educational content using the "5 Levels" methodology - explaining concepts from child-friendly simplicity to expert-level depth.

## Overview

The system consists of three main components:

1. **Telegram Slash Command**: `/5levels [keyword]` triggers automatic research
2. **AI Research Pipeline**: Autonomous agent researches and generates bilingual content
3. **Web Interface**: Modern, responsive website displaying the content

## User Flow

```
User sends: /5levels quantum computing
     ↓
Chatbot creates immediate job (no approval needed for slash commands)
     ↓
Research agent:
  • Searches English and Japanese sources
  • Generates 5 levels in both languages
  • Culturally adapts (not just translates)
  • Creates JSON data file
  • Commits to repository
     ↓
Website automatically updates
     ↓
User receives link to published content
```

## Architecture

### 1. Chat Integration (`operating_system/CHATBOT.md`)

The chatbot recognizes `/5levels [keyword]` and immediately creates a job without requiring approval (special handling for slash commands).

**Job template:**
```
Read the file at /job/.pi/skills/5levels/SKILL.md and follow its instructions to create a bilingual 5-level explanation for: [keyword]

Research thoroughly using both English and Japanese sources, generate culturally adapted content for all 5 levels in both languages, and publish to the website.
```

### 2. Research Skill (`.pi/skills/5levels/SKILL.md`)

The skill provides detailed instructions for:
- **Research methodology**: Where to search, what sources to use
- **Content structure**: What each level should contain
- **Cultural adaptation**: How to adapt, not just translate
- **Quality standards**: Citations, accuracy, completeness

### 3. Website (`website/`)

A React-based static site with:
- **Language toggle**: Fixed top-right, pill-style active state
- **Archive view**: Cards showing all topics with search/filter
- **Topic detail**: Full 5-level breakdown with sources
- **Design system**: Exact color coding, typography, spacing

## Design System

### Colors

Each level has a specific color for visual consistency:

- **Level 1** (Child): `#E3B341` - Warm gold
- **Level 2** (Teen): `#E07A3F` - Vibrant orange
- **Level 3** (Undergraduate): `#C06C84` - Mature rose
- **Level 4** (Graduate): `#4C78A8` - Deep blue
- **Level 5** (Expert): `#2A8F87` - Sophisticated teal

### Typography

- **Headings**: Copernicus Trial serif (Georgia fallback)
- **Body**: Hanken Grotesk sans-serif
- **Responsive**: Fluid sizing with `clamp()` for all screen sizes

### Layout

- **Max width**: 800px centered container
- **Border radius**: 24px for cards
- **Shadows**: Subtle, layered depth effects
- **Spacing**: Consistent scale using CSS custom properties

## Content Guidelines

### Level 1: Child (5-10 years)

**Audience**: Elementary school children

**Style**:
- Simple, everyday language
- Concrete examples from daily life
- No jargon or technical terms
- Focus on "what" not "why"

**Length**: 2-3 short paragraphs

**Example**: "Imagine you have a magic coin..."

### Level 2: Teen (13-17 years)

**Audience**: Middle/high school students

**Style**:
- Add detail and context
- Relatable scenarios for that age
- Basic mechanisms explained
- Light introduction to "why"

**Length**: 3-4 paragraphs

**Example**: "Regular computers use bits—either 0 or 1, like a light switch..."

### Level 3: Undergraduate Student

**Audience**: University students (years 1-4)

**Style**:
- Technical terminology introduced
- Academic frameworks
- Historical context
- Current applications

**Length**: 4-5 paragraphs

**Example**: "Quantum computing leverages principles of quantum mechanics—specifically superposition and entanglement..."

### Level 4: Graduate Student

**Audience**: Master's/PhD students

**Style**:
- Advanced concepts and theory
- Research methodologies
- Interdisciplinary connections
- Critical analysis

**Length**: 5-6 paragraphs

**Example**: "Quantum computation operates on the principle that quantum systems evolve according to unitary transformations in Hilbert space..."

### Level 5: Expert

**Audience**: Researchers and specialists

**Style**:
- Cutting-edge research
- Unsolved problems
- Current debates in the field
- Cultural/regional differences
- Future directions

**Length**: 6-8 paragraphs

**Example**: "The theoretical foundations of quantum computation rest on the quantum circuit model's universality and the Church-Turing-Deutsch thesis..."

## Research Process

### English Sources

1. **Wikipedia**: Foundational concepts and overview
2. **Educational Sites**: Khan Academy, Coursera, MIT OCW
3. **Academic Papers**: Google Scholar, arXiv
4. **News**: Recent developments and applications
5. **Social Media**: X/Twitter, Reddit discussions
6. **Industry**: Company blogs, technical documentation

### Japanese Sources

1. **Wikipedia日本語版**: 基礎概念と概要
2. **Educational Sites**: NHK高校講座, JMOOC
3. **Academic Sources**: CiNii, J-STAGE
4. **News**: NHK, 日経, 朝日新聞
5. **Social Media**: X/Twitter (Japanese), はてなブックマーク
6. **Industry**: 企業ブログ, 技術文書

### Using Brave Search

The research agent uses the Brave Search skill:

```bash
# English research
./search.js "[keyword] basics explanation" -n 10 --content
./search.js "[keyword] advanced concepts" -n 10 --content
./search.js "[keyword] research current" -n 10 --content --freshness pm

# Japanese research
./search.js "[キーワード] 説明" -n 10 --content --country JP
./search.js "[キーワード] 研究" -n 10 --content --country JP
./search.js "[キーワード] 応用" -n 10 --content --country JP
```

## Cultural Adaptation

**Critical**: Don't just translate—adapt the content culturally.

### English Content

- Western cultural references
- Examples from US/UK contexts
- Imperial units where appropriate
- Western historical perspectives

**Example**: "Like flipping a coin at a football game..."

### Japanese Content

- Japanese cultural references
- Local examples and contexts
- Metric units
- Japanese historical perspectives

**Example**: "まるでじゃんけんをするように..." (Like playing rock-paper-scissors...)

### Adaptation Principles

1. **Metaphors**: Use different metaphors that resonate in each culture
2. **Examples**: Change examples to be locally relevant
3. **History**: Include region-specific historical context
4. **Applications**: Highlight local industry/research applications
5. **Tone**: Adjust formality level to match cultural norms

## Data Structure

Topics are stored as JSON files in `website/public/data/topics/`:

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
        "content": "Full content here..."
      }
      // ... levels 2-5
    ],
    "ja": [
      {
        "level": 1,
        "title": "子ども（5〜10歳）",
        "content": "完全な内容はこちら..."
      }
      // ... levels 2-5
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

## Adding Topics

### Automated (via /5levels command)

The research agent automatically:
1. Creates the JSON file
2. Validates the structure
3. Adds to `website/data/topics/`
4. Runs `scripts/add-topic.js`
5. Commits changes

### Manual

```bash
cd website

# Option 1: Using the script
node scripts/add-topic.js path/to/topic.json

# Option 2: Manual
# 1. Create JSON in public/data/topics/[slug].json
# 2. Rebuild index:
node scripts/rebuild-index.js
```

## Quality Standards

### Content Quality

- **Accuracy**: Cite authoritative sources
- **Completeness**: Cover all aspects of the topic
- **Clarity**: Appropriate for target audience at each level
- **Currency**: Include recent developments (within last year)
- **Balance**: Multiple perspectives where applicable

### Source Requirements

- Minimum 2-3 sources per level
- Mix of foundational and recent sources
- Both English and Japanese sources represented
- Academic, news, and social media perspectives
- Proper attribution with title, URL, and language

### Cultural Quality

- Examples resonate in target culture
- Metaphors are culturally appropriate
- Historical context is regionally relevant
- Tone matches cultural communication norms
- No literal translations—full adaptation

## Testing

### Manual Testing

1. **Content**: Read through all 5 levels in both languages
2. **Progression**: Verify complexity increases appropriately
3. **Sources**: Check all links work and are relevant
4. **Cultural**: Ask native speakers to review both versions
5. **Technical**: Validate JSON structure

### Automated Validation

The `add-topic.js` script validates:
- Required fields present
- Both languages have all 5 levels
- Level numbers are 1-5
- ID is properly slugified
- JSON is well-formed

## Deployment

The website is a static site that auto-deploys when changes are pushed to the main branch:

1. Agent commits topic JSON file
2. GitHub Actions triggers build
3. Vite builds static site
4. Deployment service (Netlify/Vercel/GitHub Pages) publishes
5. User receives link to new topic

## Future Enhancements

Potential improvements:

- **Audio narration**: Text-to-speech for each level
- **Visual diagrams**: Auto-generated illustrations
- **Interactive elements**: Quizzes, simulations
- **Related topics**: Link to similar explanations
- **Difficulty rating**: User feedback on complexity
- **Print formatting**: PDF export for offline reading
- **Accessibility**: Enhanced screen reader support
- **Analytics**: Track which levels are most viewed

## Troubleshooting

### Topic not appearing on website

1. Check JSON file exists in `public/data/topics/`
2. Verify JSON is valid (use `node scripts/add-topic.js`)
3. Ensure `topics-index.json` includes the topic
4. Rebuild index: `node scripts/rebuild-index.js`
5. Check browser console for errors

### Content not displaying correctly

1. Verify JSON structure matches schema
2. Check for special characters (escape if needed)
3. Ensure both `en` and `ja` have 5 levels
4. Validate level numbers are 1-5
5. Check colors are valid hex codes

### Language toggle not working

1. Clear browser cache
2. Check browser console for errors
3. Verify both languages have content
4. Check LanguageToggle component state

## Examples

See `website/public/data/topics/example-quantum-computing.json` for a complete, production-ready example demonstrating:
- Proper structure
- Cultural adaptation (not translation)
- Progression from simple to complex
- Diverse, credible sources
- Both languages fully developed
