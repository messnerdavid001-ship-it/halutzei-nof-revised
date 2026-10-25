import settings from '../content/settings.json';
import ui from '../content/ui.json';
import images from '../generated/images.json';

export type Lang = 'he' | 'en';
export { settings };

export const SLUGS = ['index', 'about', 'vision', 'values', 'community', 'education', 'join', 'faq', 'contact', 'accessibility', 'privacy', 'donate'] as const;
/** Menu order. Join is rendered separately as the gold button at the end. */
export const NAV = ['index', 'about', 'vision', 'values', 'community', 'education', 'faq', 'contact'] as const;
export const NAV_KEYS: Record<string, string> = { index: 'home', about: 'about', vision: 'vision', values: 'values', community: 'community', education: 'education', faq: 'faq', contact: 'contact', join: 'join' };

/** Which Settings field holds each page's background photo. Pages not listed use legalBackground. */
const BG_KEYS: Record<string, string> = {
  index: 'homeBackground', about: 'aboutBackground', vision: 'visionBackground', values: 'valuesBackground',
  community: 'communityBackground', education: 'educationBackground', join: 'joinBackground', faq: 'faqBackground', contact: 'contactBackground',
};
export function bgFor(slug: string) {
  const key = BG_KEYS[slug];
  return { src: ((settings as any)[key || 'legalBackground'] as string) || '/photos/vision-sunset.jpg', variant: key ? slug : 'legal' };
}

export const getUi = (lang: Lang) => ui[lang];

const pageFiles = import.meta.glob('../content/pages/*.json', { eager: true }) as Record<string, { default: any }>;
export function getPage(key: string, lang: Lang) {
  const file = pageFiles[`../content/pages/${key === 'index' ? 'home' : key}.json`];
  return file.default[lang];
}

export const isRtl = (lang: Lang) => lang === 'he';

/** Prefix a root-relative path ("/photos/x.jpg") with the site's base path (GitHub project Pages). */
export const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
export const withBase = (p: string) => (p.startsWith('/') && !p.startsWith(BASE + '/') ? BASE + p : p);

export function pagePath(slug: string, lang: Lang) {
  const lp = lang === 'en' ? '/en' : '';
  return BASE + (slug === 'index' ? `${lp}/` : `${lp}/${slug}/`);
}

/** Absolute site origin: CMS setting, else SITE_URL from the deploy build (origin only, no base path). */
export const siteRoot = () =>
  (settings.siteUrl || (typeof process !== 'undefined' ? process.env.SITE_URL : '') || '').replace(/\/$/, '');

export function pageUrl(slug: string, lang: Lang) {
  const root = siteRoot();
  return root ? root + pagePath(slug, lang) : pagePath(slug, lang);
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Red TODO marker. Returns '' when it should not be shown. */
export function todoMark(kind: string, lang: Lang): string {
  if (!settings.showTodo) return '';
  const hide: Record<string, boolean> = {
    photo: settings.homePhotoLicensed,
    family: settings.familyCountVerified,
    memorial: settings.memorialApproved,
    phone: !!settings.phone,
    email: !!settings.email,
    instagram: !!settings.instagram,
    facebook: !!settings.facebook,
    form: !!settings.formAction,
    legal: !!settings.legalName[lang],
  };
  if (hide[kind]) return '';
  const msg = (getUi(lang).todo as Record<string, string>)[kind];
  if (!msg) return '';
  return `<span class="todo" data-todo="${kind}">[${escapeHtml(msg)}]</span>`;
}

/** Plain text with blank-line paragraphs and [[TOKEN]] markers -> HTML paragraphs. */
export function richText(text: string, lang: Lang): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const html = escapeHtml(p)
        .replace(/\[\[([A-Z]+)\]\]/g, (_, k) => todoMark(k.toLowerCase(), lang))
        .replace(/\n/g, '<br>');
      return `<p>${html}</p>`;
    })
    .join('');
}

/** Inline text (single line) with markers. */
export function inline(text: string, lang: Lang): string {
  return escapeHtml(text).replace(/\[\[([A-Z]+)\]\]/g, (_, k) => todoMark(k.toLowerCase(), lang));
}

export type ImgInfo = { width: number; height: number; widths: number[]; fallback: string; name: string };
export function imgInfo(src: string): ImgInfo | null {
  const name = src.split('/').pop()!.replace(/\.[a-z]+$/i, '');
  const m = (images as Record<string, any>)[name];
  return m ? { ...m, name } : null;
}

export function contactValue(kind: 'phone' | 'email' | 'instagram' | 'facebook') {
  const v = (settings as any)[kind] as string;
  return v;
}

/** "0534749499" -> "053-474-9499" */
export function phoneDisplay() {
  const d = (settings.phone || '').replace(/\D/g, '');
  return d.length === 10 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` : settings.phone;
}
/** "0534749499" -> "https://wa.me/972534749499" */
export function waLink() {
  const d = (settings.phone || '').replace(/\D/g, '');
  if (!d) return '';
  return `https://wa.me/${d.startsWith('0') ? '972' + d.slice(1) : d}`;
}
