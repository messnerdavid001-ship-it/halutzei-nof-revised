# Halutzei Nof (חלוצי נוף) website

Astro static site, Hebrew (default, RTL) + English (`/en/`). Content is JSON in `src/content`, edited through Decap CMS at `/admin`.

```
npm install
npm run dev        # http://localhost:4321  (also generates the CMS config + optimized images)
npm run build      # outputs dist/
```

- Photos: drop into `public/photos/`; `scripts/optimize-images.mjs` makes WebP + JPG variants at build.
- CMS config is generated: edit `scripts/build-cms-config.mjs`, not `public/admin/config.yml`.
- Local CMS editing: run `npx decap-server` next to `npm run dev`, then open `/admin`.
- Non-technical guide: `README-FOR-DAVE.md`. Open items: `TODO.md`.
