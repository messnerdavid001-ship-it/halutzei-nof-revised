import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH are set by the GitHub Actions deploy (.github/workflows/deploy.yml).
// Project Pages live at https://<user>.github.io/<repo>/ so BASE_PATH is "/<repo>".
// With a custom domain (or a <user>.github.io repo) BASE_PATH is empty.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
