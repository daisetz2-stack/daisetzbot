# 5Levels System Testing Guide

Complete testing checklist for the `/5levels` command system.

## Pre-Launch Checklist

### 1. Skill Installation

- [ ] Skill file exists: `.pi/skills/5levels/SKILL.md`
- [ ] Skill is properly formatted with front matter
- [ ] Research guidelines are comprehensive
- [ ] Data structure examples are correct

### 2. Chatbot Integration

- [ ] `CHATBOT.md` recognizes `/5levels` command
- [ ] Job template is correct
- [ ] No approval required for slash commands
- [ ] Job description references skill file

### 3. Website Setup

- [ ] All dependencies installed: `cd website && npm install`
- [ ] Dev server runs: `npm run dev`
- [ ] Example topic displays correctly
- [ ] Language toggle works
- [ ] Search functionality works
- [ ] Routing works (archive → topic detail → back)

### 4. Scripts

- [ ] `add-topic.js` validates JSON correctly
- [ ] `rebuild-index.js` generates valid index
- [ ] `create-topic-template.js` generates valid template
- [ ] All scripts are executable (`chmod +x`)

### 5. Data Structure

- [ ] Example topic JSON is valid
- [ ] Topics index JSON is valid
- [ ] Both languages have 5 complete levels
- [ ] Colors are defined
- [ ] Sources are included

## Component Testing

### Language Toggle Component

```bash
# Start dev server
cd website
npm run dev
```

**Test cases:**
- [ ] Toggle appears in top-right corner
- [ ] EN button activates English content
- [ ] 日 button activates Japanese content
- [ ] Active state shows pill background
- [ ] Hover states work correctly
- [ ] Mobile responsive (test at 375px width)

### Archive Page

**Test cases:**
- [ ] All topics display as cards
- [ ] Search filters topics correctly
- [ ] Cards show: title, date, level dots
- [ ] Hover effect works (lift + shadow)
- [ ] Level dots use correct colors
- [ ] Clicking card navigates to detail page
- [ ] Empty state shows when no results
- [ ] Loading state appears briefly

### Topic Detail Page

**Test cases:**
- [ ] Title displays in correct language
- [ ] Date formatted correctly for language
- [ ] All 5 levels display
- [ ] Level colors match specification
- [ ] Level numbers (1-5) visible in circles
- [ ] Content paragraphs are readable
- [ ] Sources section appears at bottom
- [ ] Source links open in new tab
- [ ] Back button returns to archive
- [ ] Language switching updates all content

### Typography

**Test cases:**
- [ ] Headings use serif font (Copernicus/Georgia)
- [ ] Body text uses sans-serif (Hanken Grotesk)
- [ ] Sizes are responsive (clamp values work)
- [ ] Line height is comfortable (1.6-1.8)
- [ ] Text hierarchy is clear

### Colors

**Test cases:**
- [ ] Background is `#F9F9F9`
- [ ] Text is `#111111`
- [ ] Level 1 is `#E3B341` (gold)
- [ ] Level 2 is `#E07A3F` (orange)
- [ ] Level 3 is `#C06C84` (rose)
- [ ] Level 4 is `#4C78A8` (blue)
- [ ] Level 5 is `#2A8F87` (teal)

### Responsive Design

Test at these breakpoints:
- [ ] Mobile: 375px (iPhone SE)
- [ ] Mobile: 390px (iPhone 12/13/14)
- [ ] Tablet: 768px (iPad)
- [ ] Desktop: 1024px
- [ ] Wide: 1440px

**What to check:**
- [ ] No horizontal scroll
- [ ] Text remains readable
- [ ] Touch targets are 44px+ on mobile
- [ ] Images/content don't overflow
- [ ] Language toggle stays fixed

## End-to-End Testing

### Manual /5levels Command Test

1. **Send command in Telegram**:
   ```
   /5levels artificial intelligence
   ```

2. **Verify chatbot response**:
   - [ ] Immediate acknowledgment
   - [ ] Job created without approval request
   - [ ] Job ID provided

3. **Monitor job execution**:
   - [ ] GitHub Actions workflow starts
   - [ ] Branch created: `job/[uuid]`
   - [ ] Docker container runs successfully
   - [ ] Logs appear in `logs/[JOB_ID]/`

4. **Check research phase**:
   - [ ] Brave Search queries executed
   - [ ] Both English and Japanese sources searched
   - [ ] Content extracted with `--content` flag
   - [ ] Recent sources included (`--freshness pm`)

5. **Verify content generation**:
   - [ ] JSON file created in `website/public/data/topics/`
   - [ ] All 5 levels written in English
   - [ ] All 5 levels written in Japanese
   - [ ] Content is culturally adapted (not just translated)
   - [ ] Sources cited properly

6. **Check PR process**:
   - [ ] PR opened from job branch
   - [ ] PR title follows convention
   - [ ] Changes only in allowed paths
   - [ ] Auto-merge workflow runs
   - [ ] PR merges automatically

7. **Verify notification**:
   - [ ] Telegram notification received
   - [ ] Link to published topic included
   - [ ] Job summary is accurate

8. **Check website**:
   - [ ] Topic appears in archive
   - [ ] Topic detail page loads
   - [ ] Both languages complete
   - [ ] All 5 levels present
   - [ ] Sources listed at bottom

### Automated Script Tests

```bash
# Test topic template creation
cd website
node scripts/create-topic-template.js "Test Topic" "テストトピック" > /tmp/test-topic.json

# Test topic validation and addition
node scripts/add-topic.js /tmp/test-topic.json

# Verify it appears
# Should see: ✓ Topic is valid
# Should see: ✓ Wrote topic to: ...
# Should see: ✓ Rebuilt index with N topics

# Test index rebuild
node scripts/rebuild-index.js

# Verify output
# Should see: Found N topic files
# Should see: ✓ [filename] for each file
# Should see: ✓ Rebuilt index with N topics
```

## Quality Assurance

### Content Quality Checklist

For each generated topic:

**Level 1 (Child)**:
- [ ] Uses simple everyday language
- [ ] Has concrete examples
- [ ] No jargon or technical terms
- [ ] 2-3 paragraphs
- [ ] Understandable by a 7-year-old

**Level 2 (Teen)**:
- [ ] More detailed than Level 1
- [ ] Relatable scenarios
- [ ] Basic mechanisms explained
- [ ] 3-4 paragraphs
- [ ] Engaging for 13-17 age group

**Level 3 (Undergraduate)**:
- [ ] Technical terminology introduced
- [ ] Academic frameworks mentioned
- [ ] Historical context provided
- [ ] 4-5 paragraphs
- [ ] University-level appropriate

**Level 4 (Graduate)**:
- [ ] Advanced concepts and theory
- [ ] Research methodologies discussed
- [ ] Interdisciplinary connections
- [ ] 5-6 paragraphs
- [ ] Graduate-level depth

**Level 5 (Expert)**:
- [ ] Cutting-edge research mentioned
- [ ] Unsolved problems highlighted
- [ ] Current debates in field
- [ ] Future directions discussed
- [ ] 6-8 paragraphs
- [ ] Expert-level sophistication

### Cultural Adaptation Quality

**English version**:
- [ ] Uses Western cultural references
- [ ] Examples from US/UK/Western context
- [ ] Imperial units where appropriate
- [ ] Western historical perspective
- [ ] Tone appropriate for Western audience

**Japanese version**:
- [ ] Uses Japanese cultural references
- [ ] Examples from Japanese context
- [ ] Metric units used
- [ ] Japanese historical perspective
- [ ] Tone appropriate for Japanese audience
- [ ] Not a direct translation of English

### Source Quality

- [ ] Minimum 2-3 sources per level
- [ ] Mix of foundational and recent sources
- [ ] Both English and Japanese sources
- [ ] Academic, news, and social perspectives
- [ ] All links are working
- [ ] Proper attribution (title, URL, language)

## Performance Testing

### Load Testing

```bash
# Add 10 topics rapidly
for i in {1..10}; do
  node scripts/create-topic-template.js "Topic $i" "トピック$i" > /tmp/topic-$i.json
  # Edit JSON to add content
  node scripts/add-topic.js /tmp/topic-$i.json
done

# Check performance
npm run build
# Build should complete in <30 seconds
```

### Build Size

```bash
cd website
npm run build

# Check build output
du -sh dist/
# Should be <5MB for reasonable number of topics
```

### Page Load Speed

Use browser DevTools:
- [ ] Archive page: <1s initial load
- [ ] Topic detail: <1s initial load
- [ ] Language switch: <100ms
- [ ] Search/filter: instant

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA
- [ ] Text is resizable to 200%

## Security Testing

- [ ] No secrets in JavaScript bundles
- [ ] External links have `rel="noopener noreferrer"`
- [ ] Input sanitization (search box)
- [ ] No XSS vulnerabilities
- [ ] CSP headers configured (if using)

## Deployment Testing

### GitHub Pages

```bash
# Build and deploy
npm run build

# Test deployed version
# Check: https://username.github.io/daisetz/
```

### Netlify

- [ ] Build command works: `cd website && npm run build`
- [ ] Publish directory correct: `website/dist`
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] Deploy previews working

### Vercel

- [ ] Root directory set: `website`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Auto-deploys on push to main
- [ ] Deploy previews working

## Troubleshooting Tests

### Simulate Common Errors

**Invalid JSON**:
```bash
echo '{ invalid json }' > /tmp/bad-topic.json
node scripts/add-topic.js /tmp/bad-topic.json
# Should see: Error: Unexpected token
```

**Missing required field**:
```bash
echo '{"id": "test"}' > /tmp/incomplete-topic.json
node scripts/add-topic.js /tmp/incomplete-topic.json
# Should see: Error: Missing required field
```

**Wrong level count**:
```bash
# Create topic with only 3 levels
node scripts/add-topic.js /tmp/short-topic.json
# Should see: Error: Each language must have exactly 5 levels
```

## Regression Testing

After any code changes:

1. **Run all component tests** (above)
2. **Test a new `/5levels` command** end-to-end
3. **Verify existing topics** still display correctly
4. **Check build output** hasn't grown unexpectedly
5. **Test on mobile device** (not just emulator)
6. **Verify both languages** work completely

## Sign-Off Checklist

Before marking the feature as complete:

- [ ] All automated tests pass
- [ ] Manual testing completed
- [ ] Documentation is accurate and complete
- [ ] Example topic is high quality
- [ ] Website is deployed and accessible
- [ ] Telegram command works end-to-end
- [ ] No console errors in browser
- [ ] Mobile experience is excellent
- [ ] Both languages are fully functional
- [ ] Performance is acceptable

## Known Issues / Future Improvements

Document any issues or planned improvements:

```
## Known Issues
- [ ] Issue 1: Description
- [ ] Issue 2: Description

## Future Improvements
- [ ] Feature 1: Description
- [ ] Feature 2: Description
```

---

**Test results should be documented in a GitHub issue or PR comment.**
