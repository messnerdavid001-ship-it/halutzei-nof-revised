import { BASE, pagePath, siteRoot } from '../lib/site';

export function GET() {
  const root = siteRoot();
  const sitemap = root ? `\nSitemap: ${root}${pagePath('index', 'he').replace(/\/$/, '')}/sitemap.xml\n` : '\n';
  return new Response(`User-agent: *\nAllow: /\nDisallow: ${BASE}/admin/${sitemap}`, { headers: { 'Content-Type': 'text/plain' } });
}
