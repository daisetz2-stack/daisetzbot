# 5Levels Deployment Guide

Complete guide for deploying the 5Levels website to production.

## Prerequisites

- GitHub repository with the 5levels system
- Node.js 18+ installed locally
- Git and GitHub CLI configured
- Domain name (optional, for custom domain)

## Deployment Options

### Option 1: GitHub Pages (Recommended for Public Repos)

**Pros:**
- Free for public repos
- Automatic HTTPS
- Simple setup
- Good performance

**Cons:**
- Public repos only (for free)
- Limited to 1GB
- No serverless functions

#### Setup Steps

1. **Create deployment workflow**:

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy-website.yml`:

```yaml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'website/**'
      - '.github/workflows/deploy-website.yml'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: website/package-lock.json

      - name: Install dependencies
        working-directory: website
        run: npm ci

      - name: Build
        working-directory: website
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: website/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Save

3. **Update base path** (if using project pages):

In `website/vite.config.js`:

```javascript
export default defineConfig({
  base: '/thepopebot/', // Change to your repo name
  plugins: [react()],
  // ... rest of config
});
```

4. **Push to GitHub**:

```bash
git add .github/workflows/deploy-website.yml website/vite.config.js
git commit -m "Add GitHub Pages deployment"
git push origin main
```

5. **Access your site**:
   - Public: `https://username.github.io/thepopebot/`
   - Custom domain: Configure in Settings → Pages

---

### Option 2: Netlify (Recommended for All Repos)

**Pros:**
- Free tier very generous
- Excellent performance (global CDN)
- Deploy previews for PRs
- Custom domains easy
- Works with private repos

**Cons:**
- Build minutes limited on free tier
- Requires external account

#### Setup Steps

1. **Sign up at [netlify.com](https://netlify.com)**

2. **Connect your repository**:
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure build settings**:
   ```
   Base directory: website
   Build command: npm run build
   Publish directory: website/dist
   ```

4. **Deploy**!
   - Netlify will auto-deploy on every push to main
   - You'll get a URL like: `https://your-site.netlify.app`

5. **Add custom domain** (optional):
   - Go to Site settings → Domain management
   - Add custom domain
   - Update DNS records as instructed
   - Netlify provides automatic HTTPS

6. **Environment variables** (if needed):
   - Site settings → Environment variables
   - Add any required variables

---

### Option 3: Vercel (Alternative to Netlify)

**Pros:**
- Free tier generous
- Excellent performance
- Deploy previews
- Easy custom domains
- Great DX

**Cons:**
- Build time limits on free tier
- Requires external account

#### Setup Steps

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Import project**:
   - Click "Add New" → "Project"
   - Import from GitHub
   - Select your repository

3. **Configure project**:
   ```
   Framework Preset: Vite
   Root Directory: website
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Deploy**:
   - Auto-deploys on push to main
   - URL: `https://your-site.vercel.app`

5. **Custom domain**:
   - Project Settings → Domains
   - Add domain and follow DNS instructions

---

### Option 4: Self-Hosted (VPS/Server)

**Pros:**
- Full control
- No build limits
- Can add backend services

**Cons:**
- Requires server management
- Not free
- Need to handle SSL, updates, etc.

#### Setup Steps

1. **Build locally**:

```bash
cd website
npm install
npm run build
```

2. **Upload to server**:

```bash
# Via rsync
rsync -avz dist/ user@server:/var/www/5levels/

# Or via SCP
scp -r dist/* user@server:/var/www/5levels/
```

3. **Configure web server** (nginx example):

```nginx
server {
    listen 80;
    server_name 5levels.yourdomain.com;
    root /var/www/5levels;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

4. **Enable HTTPS with Let's Encrypt**:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 5levels.yourdomain.com
```

---

## Automated Deployment with Git

### Continuous Deployment

All options support automatic deployment when you push to main. The workflow:

```
1. Agent commits new topic JSON
2. PR auto-merges to main
3. Deployment triggers automatically
4. New topic appears on website
```

### Manual Deployment

If you need to deploy manually:

```bash
# Build
cd website
npm run build

# For GitHub Pages (with gh CLI)
cd dist
git init
git add -A
git commit -m "Deploy"
git push -f git@github.com:username/thepopebot.git main:gh-pages

# For Netlify CLI
netlify deploy --prod --dir=dist

# For Vercel CLI
vercel --prod
```

---

## Post-Deployment Checklist

### Verify Deployment

- [ ] Website loads at production URL
- [ ] All topics display correctly
- [ ] Language toggle works
- [ ] Search functionality works
- [ ] Links are not broken
- [ ] Both languages fully functional
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] No console errors

### Performance Check

Use [PageSpeed Insights](https://pagespeed.web.dev/):

- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90

If scores are low:
- Check image sizes
- Enable caching headers
- Minify JS/CSS (Vite does this)
- Use CDN for assets

### SEO Setup

1. **Add sitemap** (`website/public/sitemap.xml`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Add topic URLs dynamically -->
</urlset>
```

2. **Update robots.txt** (already created):

```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

3. **Add meta tags** in `website/index.html`:

```html
<meta name="description" content="Educational explanations in 5 levels - from child to expert" />
<meta property="og:title" content="5Levels - Bilingual Educational Explanations" />
<meta property="og:description" content="Complex concepts explained simply" />
<meta property="og:image" content="/og-image.png" />
<meta property="og:url" content="https://yourdomain.com" />
<meta name="twitter:card" content="summary_large_image" />
```

4. **Submit to search engines**:
   - [Google Search Console](https://search.google.com/search-console)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

## Monitoring

### Analytics

Add to `website/index.html` before `</head>`:

**Google Analytics:**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Plausible (privacy-friendly):**
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Error Tracking

Add Sentry (optional):

```bash
cd website
npm install @sentry/react
```

In `website/src/main.jsx`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## Updating Content

### Adding New Topics

Topics are automatically added when users trigger `/5levels` commands. Manual process:

```bash
# Create topic JSON
node website/scripts/create-topic-template.js "New Topic" "新しいトピック" > /tmp/new-topic.json

# Edit /tmp/new-topic.json with content

# Add to website
node website/scripts/add-topic.js /tmp/new-topic.json

# Commit and push
git add website/public/data/
git commit -m "Add topic: New Topic"
git push origin main

# Deployment happens automatically
```

### Bulk Updates

If you need to update all topics:

```bash
# Rebuild index
cd website
node scripts/rebuild-index.js

# Commit
git add public/data/topics-index.json
git commit -m "Rebuild topics index"
git push origin main
```

---

## Troubleshooting

### Build Fails

**Check logs:**
- GitHub Actions: Actions tab → failed workflow
- Netlify: Deploys → failed deploy → logs
- Vercel: Deployments → failed deployment → logs

**Common issues:**
- Missing dependencies: `npm ci` instead of `npm install`
- Wrong Node version: Specify in workflow/settings
- Build command wrong: Check `package.json` scripts
- Out of memory: Increase Node memory (`NODE_OPTIONS=--max-old-space-size=4096`)

### Site Not Updating

1. **Check if build/deploy succeeded**
2. **Clear browser cache**: Ctrl+Shift+R (or Cmd+Shift+R)
3. **Check CDN cache**: Wait 5-10 minutes for propagation
4. **Verify files changed**: Check git commits
5. **Rebuild manually**: Trigger deployment again

### 404 Errors

**On GitHub Pages:**
- Ensure `base` is set correctly in `vite.config.js`
- Check that `dist/index.html` exists after build

**On Netlify/Vercel:**
- SPA routing should work automatically
- Check that `_redirects` or `vercel.json` is included if needed

Add `website/public/_redirects` (Netlify):
```
/*    /index.html   200
```

Or `website/public/vercel.json` (Vercel):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Performance Issues

1. **Check bundle size**: `npm run build` shows size warnings
2. **Lazy load routes**: Use React.lazy() for pages
3. **Optimize images**: Compress before committing
4. **Enable compression**: Gzip/Brotli at server level
5. **Use CDN**: All recommended hosts include CDN

---

## Rollback

If something goes wrong:

**GitHub Pages:**
```bash
git revert HEAD
git push origin main
```

**Netlify:**
- Go to Deploys → find previous working deploy → click "Publish deploy"

**Vercel:**
- Go to Deployments → find previous working → Promote to Production

---

## Security

### Content Security Policy

Add to `website/index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
">
```

### HTTPS

All recommended hosts provide automatic HTTPS. For self-hosted:

```bash
# Let's Encrypt (free)
sudo certbot --nginx -d yourdomain.com
sudo certbot renew --dry-run  # Test renewal
```

---

## Costs

### GitHub Pages
- **Public repos**: Free
- **Private repos**: Free (with limits)
- **Bandwidth**: 100GB/month soft limit

### Netlify
- **Bandwidth**: 100GB/month
- **Build minutes**: 300 minutes/month
- **Sites**: Unlimited
- **Cost**: $0 (free tier)

### Vercel
- **Bandwidth**: 100GB/month
- **Build time**: 100 hours/month
- **Sites**: Unlimited
- **Cost**: $0 (free tier)

All free tiers are more than sufficient for typical 5Levels usage.

---

## Next Steps

After deployment:
1. ✅ Verify site works completely
2. 📊 Set up analytics
3. 🔍 Submit sitemap to search engines
4. 📱 Test on real mobile devices
5. 🚀 Share the URL!

Your 5Levels site is now live! 🎉
