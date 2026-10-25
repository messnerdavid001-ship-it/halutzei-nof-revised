# Halutzei Nof (חלוצי נוף) website

Astro static site, Hebrew (default, RTL) + English (`/en/`). Content is JSON in `src/content`, edited through Sveltia CMS (Decap-compatible) at `/admin`. Hosting is local for now: nothing is deployed. `deploy/github-pages-deploy.yml` is kept as-is for later.

```
npm install
npm run dev        # http://localhost:4321  (also generates the CMS config + optimized images)
npm run build      # outputs dist/
```

- Photos: drop into `public/photos/`; `scripts/optimize-images.mjs` makes WebP + JPG variants at build.
- CMS config is generated: edit `scripts/build-cms-config.mjs`, not `public/admin/config.yml`.
- Local CMS editing: run `npm run dev`, open `/admin/index.html` in Chrome and choose "Work with Local Repository".
- Pages: home, about, vision (+ values), community (+ education), join (+ faq), contact, accessibility, privacy (+ donate, off by default). Both forms (join, contact) post to the same FormSubmit address with a hidden `form_type`.
- Set "Site address" in CMS → Settings once hosting is chosen (sitemap, hreflang, share image).
- Non-technical guide: `README-FOR-DAVE.md`. Open items: `TODO.md`.
