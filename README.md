# Halutzei Nof (חלוצי נוף) website

Astro static site, Hebrew (default, RTL) + English (`/en/`). Content is JSON in `src/content`, edited through Sveltia CMS (Decap-compatible) at `/admin`, which commits to this repo. Every push to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.

```
npm install
npm run dev        # http://localhost:4321  (also generates the CMS config + optimized images)
npm run build      # outputs dist/
```

- Photos: drop into `public/photos/`; `scripts/optimize-images.mjs` makes WebP + JPG variants at build.
- CMS config is generated: edit `scripts/build-cms-config.mjs`, not `public/admin/config.yml`.
- Local CMS editing: run `npm run dev`, open `/admin/index.html` in Chrome and choose "Work with Local Repository".
- Deploy env: `SITE_URL` and `BASE_PATH` are set by the workflow (a `public/CNAME` file switches to a custom domain at the root).
- Non-technical guide: `README-FOR-DAVE.md`. Open items: `TODO.md`.
