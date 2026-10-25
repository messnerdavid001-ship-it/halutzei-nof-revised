// Sitemap with Hebrew/English alternates. The Donate page is never listed.
import { SLUGS, pagePath, siteRoot } from '../lib/site';

export function GET() {
  const root = siteRoot();
  const abs = (p: string) => (root ? root + p : p);
  const urls = SLUGS.filter((s) => s !== 'donate')
    .map((s) => {
      const he = abs(pagePath(s, 'he'));
      const en = abs(pagePath(s, 'en'));
      return `  <url>
    <loc>${he}</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${he}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
  </url>
  <url>
    <loc>${en}</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${he}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
  </url>`;
    })
    .join('\n');
  const note = root ? '' : '<!-- Set "Site address" in CMS > Settings so these become full https:// addresses. -->\n';
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n${note}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
}
