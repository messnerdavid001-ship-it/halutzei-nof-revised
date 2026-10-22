import settings from '../content/settings.json';
import ui from '../content/ui.json';
import images from '../generated/images.json';

export type Lang = 'he' | 'en';
export { settings };

export const SLUGS = ['index', 'about', 'vision', 'community', 'partners', 'contact', 'accessibility', 'privacy', 'donate'] as const;
export const NAV = ['index', 'about', 'vision', 'community', 'partners', 'contact'] as const;
export const NAV_KEYS: Record<string, string> = { index: 'home', about: 'about', vision: 'vision', community: 'community', partners: 'partners', contact: 'contact' };

export const getUi = (lang: Lang) => ui[lang];

const pageFiles = import.meta.glob('../content/pages/*.json', { eager: true }) as Record<string, { default: any }>;
export function getPage(key: string, lang: Lang) {
  const file = pageFiles[`../content/pages/${key === 'index' ? 'home' : key}.json`];
  return file.default[lang];
}

export const isRtl = (lang: Lang) => lang === 'he';

export function pagePath(slug: string, lang: Lang) {
  const base = lang === 'en' ? '/en' : '';
  return slug === 'index' ? `${base}/` : `${base}/${slug}/`;
}

/** Absolute site address: CMS setting, else the address the host (Netlify) provides at build time. */
export const siteRoot = () =>
  (settings.siteUrl || (typeof process !== 'undefined' ? process.env.URL : '') || '').replace(/\/$/, '');

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
    phone: !!(settings.phone || settings.whatsapp),
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

export function contactValue(kind: 'phone' | 'whatsapp' | 'email' | 'instagram' | 'facebook') {
  const v = (settings as any)[kind] as string;
  return kind === 'whatsapp' ? v || settings.phone : v;
}

export function formatDate(iso: string, lang: Lang) {
  const d = new Date(iso);
  if (isNaN(+d)) return iso;
  return new Intl.DateTimeFormat(lang === 'he' ? 'he-IL' : 'en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(d);
}

export function getEvents(lang: Lang) {
  const files = import.meta.glob('../content/events/*.json', { eager: true }) as Record<string, { default: any }>;
  return Object.values(files)
    .map((f) => f.default)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .map((e) => ({
      title: e[`title_${lang}`] || e.title_he || e.title_en,
      date: e.date,
      place: e[`place_${lang}`] || '',
      description: e[`description_${lang}`] || '',
      photo: e.photo || '',
      photoAlt: e[`photoAlt_${lang}`] || '',
    }))
    .filter((e) => e.title);
}
