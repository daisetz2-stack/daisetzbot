# 5Levels Quick Start Guide

Get started with the `/5levels` command system in under 5 minutes.

## For Users

### Creating a 5Levels Explanation

1. **Open Telegram** and message your thepopebot
2. **Send the command**: `/5levels [topic]`
   ```
   /5levels quantum computing
   /5levels blockchain
   /5levels 量子コンピューティング
   ```
3. **Wait for research** (15-30 minutes)
4. **Get the link** to your bilingual 5-level explanation

That's it! The bot handles:
- ✅ Research across English and Japanese sources
- ✅ Content generation for all 5 levels
- ✅ Cultural adaptation (not just translation)
- ✅ Website publishing
- ✅ Source citations

### What You'll Get

A bilingual webpage with:
- **5 levels of explanation**: Child → Teen → Undergraduate → Graduate → Expert
- **Both English and Japanese**: Culturally adapted, not just translated
- **Interactive language toggle**: Switch between languages seamlessly
- **Source citations**: All research properly attributed
- **Beautiful design**: Modern, responsive interface

## For Developers

### Testing the System

1. **Clone the repo**:
   ```bash
   git clone [your-repo-url]
   cd thepopebot
   ```

2. **Set up the website**:
   ```bash
   cd website
   npm install
   npm run dev
   ```
   Visit http://localhost:3000

3. **View the example topic**:
   - Homepage shows the quantum computing example
   - Click to see the full 5-level breakdown
   - Toggle between English and Japanese

### Adding a Topic Manually

1. **Create a JSON file** following the structure in `docs/5LEVELS.md`

2. **Add it to the website**:
   ```bash
   cd website
   node scripts/add-topic.js path/to/your-topic.json
   ```

3. **Verify it appears**:
   - Refresh the dev server
   - Topic should appear on the homepage
   - Click to view the full breakdown

### Customizing the Design

The design system is defined in `website/src/styles/variables.css`:

```css
/* Change level colors */
--color-level-1: #E3B341;  /* Level 1 color */
--color-level-2: #E07A3F;  /* Level 2 color */
/* etc... */

/* Change fonts */
--font-serif: 'Copernicus', Georgia, serif;
--font-sans: 'Hanken Grotesk', sans-serif;

/* Change spacing */
--container-max-width: 800px;
--border-radius: 24px;
```

## For Bot Operators

### Setting Up the /5levels Command

1. **Ensure Brave Search API is configured**:
   ```bash
   # Add to LLM_SECRETS
   {
     "BRAVE_API_KEY": "your-api-key"
   }
   ```

2. **Deploy the chatbot**:
   - The `/5levels` command is already configured in `operating_system/CHATBOT.md`
   - No additional setup needed

3. **Test the command**:
   ```
   /5levels artificial intelligence
   ```

4. **Monitor the job**:
   - Job will appear in your repository's Actions tab
   - Logs saved to `logs/[JOB_ID]/`
   - PR auto-merges to main when complete

### Deployment Options

#### GitHub Pages

```bash
# Add to .github/workflows/deploy.yml
name: Deploy Website
on:
  push:
    branches: [main]
    paths:
      - 'website/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd website && npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./website/dist
```

#### Netlify

1. Connect your repo to Netlify
2. Set build command: `cd website && npm run build`
3. Set publish directory: `website/dist`
4. Deploy!

#### Vercel

1. Import your repo to Vercel
2. Set root directory: `website`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

## Common Issues

### "Topic not appearing on website"

**Solution**: Rebuild the index
```bash
cd website
node scripts/rebuild-index.js
```

### "Brave Search API error"

**Solution**: Check your API key
```bash
# Test the API key
cd .pi/skills/brave-search
export BRAVE_API_KEY="your-key"
./search.js "test query"
```

### "Website not building"

**Solution**: Check dependencies
```bash
cd website
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "Language toggle not working"

**Solution**: Clear cache and reload
```bash
# In browser console:
localStorage.clear();
location.reload();
```

## Next Steps

- **Read the full docs**: `docs/5LEVELS.md`
- **Customize the design**: Edit `website/src/styles/`
- **Add your own topics**: Use `scripts/add-topic.js`
- **Integrate with your bot**: Follow `CLAUDE.md`

## Support

- **Issues**: Open an issue on GitHub
- **Questions**: Check the docs in `docs/5LEVELS.md`
- **Examples**: See `website/public/data/topics/example-quantum-computing.json`

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/5levels [topic]` | Create a new 5-level explanation |
| `npm run dev` | Start website dev server |
| `npm run build` | Build website for production |
| `node scripts/add-topic.js <file>` | Add a topic to the website |
| `node scripts/rebuild-index.js` | Rebuild the topics index |

## Design Colors

| Level | Color | Hex |
|-------|-------|-----|
| Level 1 (Child) | Gold | `#E3B341` |
| Level 2 (Teen) | Orange | `#E07A3F` |
| Level 3 (Undergraduate) | Rose | `#C06C84` |
| Level 4 (Graduate) | Blue | `#4C78A8` |
| Level 5 (Expert) | Teal | `#2A8F87` |

## Example Topics to Try

- `/5levels machine learning`
- `/5levels climate change`
- `/5levels blockchain`
- `/5levels gene editing`
- `/5levels dark matter`
- `/5levels 人工知能` (Japanese)
- `/5levels 気候変動` (Japanese)

Ready to create amazing educational content? Try `/5levels` now! 🚀
