# omoomi website

Static GitHub Pages site for omoomi. The current site is a refreshed multi-page launch site with extensionless public routes.

## Site Structure

- `index.html` - Home page
- `about/index.html` - About page served at `/about/`
- `start/index.html` - Early-access page served at `/start/`
- `404.html` - Not found page
- `_drafts/legal/privacy.html` - Draft legal document, not published by GitHub Pages
- `_drafts/legal/terms.html` - Draft legal document, not published by GitHub Pages
- `_config.yml` - GitHub Pages/Jekyll exclude rules for unpublished drafts
- `assets/css/styles.css` - Shared styles and design tokens
- `assets/js/nav.js` - Mobile navigation behavior
- `assets/images/` - Current static assets

## Current State

- Public messaging uses "Launching soon" for conversion CTAs.
- Existing "Live" feature labels are preserved.
- Public URLs are extensionless: `/`, `/about/`, and `/start/`.
- Draft legal pages are excluded from the public footer, sitemap, and published site.

## Development

Preview locally with a static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Deployment

Automatically deployed via GitHub Pages when pushed to the main branch.
