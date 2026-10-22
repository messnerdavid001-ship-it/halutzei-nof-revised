import { defineConfig } from 'astro/config';

// Set `site` to the live address (or put it in "Site address" in the CMS settings
// and rebuild) so canonical / hreflang links are absolute.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
