// Generates public/admin/config.yml (Decap CMS) so Hebrew/English fields stay in sync.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

// GitHub repo the CMS commits to: set by GitHub Actions, else read from the local git remote.
const repo = (() => {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  try {
    const m = execSync('git remote get-url origin', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().match(/github\.com[:/](.+?)(\.git)?\s*$/);
    if (m) return m[1];
  } catch { /* no remote yet */ }
  return 'OWNER/REPO';
})();

const y = (o, ind = 0) => {
  const pad = '  '.repeat(ind);
  if (Array.isArray(o)) return o.map((v) => (typeof v === 'object' && v !== null ? `${pad}-${y(v, ind + 1).replace(/^\s*/, ' ')}` : `${pad}- ${JSON.stringify(v)}`)).join('\n');
  return Object.entries(o)
    .map(([k, v]) => {
      if (v === undefined) return null;
      if (Array.isArray(v) || (typeof v === 'object' && v !== null)) return `${pad}${k}:\n${y(v, ind + 1)}`;
      return `${pad}${k}: ${JSON.stringify(v)}`;
    })
    .filter(Boolean)
    .join('\n');
};

const text = (name, label, extra = {}) => ({ label, name, widget: 'string', required: false, ...extra });
const area = (name, label, hint) => ({ label, name, widget: 'text', required: false, hint });
const img = (name, label, extra = {}) => ({ label, name, widget: 'image', required: false, media_library: { config: { multiple: false } }, ...extra });
const list = (name, label) => ({ label, name, widget: 'list', field: { label: 'פריט / Item', name: 'item', widget: 'string' } });
const objList = (name, label, fields) => ({ label, name, widget: 'list', fields });
const bilingual = (fieldsFn) => [
  { label: 'עברית (Hebrew)', name: 'he', widget: 'object', collapsed: false, fields: fieldsFn('he') },
  { label: 'English', name: 'en', widget: 'object', collapsed: false, fields: fieldsFn('en') },
];
const seo = [text('seoTitle', 'כותרת לגוגל / SEO title'), area('seoDescription', 'תיאור לגוגל / SEO description')];
const MARK = 'טיפ: [[DRAFT]] מוסיף סימון אדום "טקסט זמני - ממתין לנוסח הסופי". מחקו אותו כשהנוסח סופי / Tip: [[DRAFT]] shows the red "placeholder copy" marker. Delete it when the wording is final.';
const PARA = 'שורה ריקה = פסקה חדשה / A blank line starts a new paragraph. ' + '[[DRAFT]] = red "final wording needed" marker.';

const filesEntry = (file, label, fields) => ({ name: file.split('/').pop().replace('.json', ''), label, file: `src/content/${file}`, fields });
const page = (key, label, fnFields) => filesEntry(`pages/${key}.json`, label, bilingual(fnFields));

const bgAlt = text('backgroundAlt', 'תיאור תמונת הרקע (נגישות) / Background photo description (alt)');
const ICONS = ['zion', 'family', 'education', 'national', 'service', 'mutual', 'work', 'independence', 'unity', 'form', 'chat', 'people', 'path', 'sunrise', 'house', 'lightbulb'];
const icon = () => ({ label: 'אייקון / Icon', name: 'icon', widget: 'select', options: ICONS, default: 'people' });
const PAGES = ['about', 'vision', 'community', 'contact'];
const pageLink = () => ({ label: 'קישור לעמוד / Links to page', name: 'link', widget: 'select', options: PAGES, default: 'about' });
// Vision and Community share one structure: groups of short cards.
const MARKS = 'סימניות [[BM1]]-[[BM8]] הן הצעות (כחול) / [[BM1]]-[[BM8]] are blue bookmarks with ideas - delete them once handled.';
const cardsPage = (key, label) => page(key, label, () => [
  ...seo, text('title', 'כותרת / Title'), bgAlt, area('intro', 'משפט פתיחה קצר / One-line summary', MARK),
  objList('groups', 'קבוצות כרטיסים (כל קבוצה בתיבה משלה) / Card groups (each in its own box)', [
    text('id', 'מזהה לקישור (באנגלית, בלי רווחים) / Link id (English, no spaces)'), text('title', 'כותרת / Title'), area('intro', 'פתיח לקבוצה (לא חובה) / Group intro (optional)', MARK),
    objList('cards', 'כרטיסים / Cards', [icon(), text('title', 'כותרת קצרה (2-4 מילים) / Short title (2-4 words)'), area('text', 'משפט אחד / One line')]),
  ]),
  text('ctaTitle', 'כותרת הזמנה בסוף העמוד / Closing call-to-action title'), area('ctaText', 'טקסט הזמנה / Closing call-to-action text', MARK),
]);

const pages = [
  page('home', '🏠 בית / Home', () => [
    ...seo, text('headline', 'משפט ראשי / Main line'), text('tagline', 'סלוגן / Slogan'), bgAlt,
    text('teasersTitle', 'כותרת כרטיסי ההיכרות / Teaser cards title'),
    objList('teasers', 'כרטיסי היכרות (קישור לעמודים) / Teaser cards (link to pages)', [icon(), text('title', 'כותרת / Title'), area('text', 'טקסט קצר / Short text'), pageLink()]),
    text('audienceTitle', 'כותרת "למי" / Who-it-is-for title'),
    area('audienceText', 'למי הקהילה מיועדת (פסקה אחת) / Who it is for (one paragraph)', MARK),
    objList('photos', 'תמונות מתחת לאזור הראשי (עד 2) / Photos below the intro (up to 2)', [img('image', 'תמונה / Photo'), text('alt', 'תיאור התמונה / Alt text')]),
    text('ctaTitle', 'כותרת הזמנה בסוף / Closing call-to-action title'), area('ctaText', 'טקסט הזמנה / Closing call-to-action text', MARK),
  ]),
  page('about', '👥 מי אנחנו / About', () => [
    ...seo, text('title', 'כותרת / Title'), bgAlt, text('intro', 'משפט פתיחה קצר / One-line summary'),
    text('identityTitle', 'כותרת זהות הקהילה / Identity title'), area('identity', 'זהות הקהילה / Community identity', MARK),
    text('memorialTitle', 'כותרת לזכרם / Memorial title'), text('memorialTag', 'שורה קטנה בתחתית כל כרטיס / Small line at the bottom of each card'), area('memorialIntro', 'פתיח לזכרם / Memorial intro'),
    objList('memorials', 'הנופלים (6) / The fallen (6)', [text('name', 'שם / Name'), area('text', 'טקסט קצר / Short text'), img('photo', 'תמונה / Photo'), text('photoAlt', 'תיאור התמונה / Alt text')]),
  ]),
  cardsPage('vision', '🌄 החזון / Vision'),
  cardsPage('community', '🤝 הקהילה / Community'),
  page('contact', '✉️ צור קשר והצטרפות / Contact & Join', () => [
    ...seo, text('title', 'כותרת / Title'), bgAlt, area('intro', 'מבוא / Intro'),
    area('joinIntro', 'טקסט מעל טופס ההצטרפות / Text above the join form', MARK),
    text('stepsTitle', 'כותרת השלבים / Steps title'),
    objList('steps', 'ארבעת השלבים / The four steps', [icon(), text('title', 'כותרת / Title'), text('text', 'טקסט קצר / Short text')]),
    text('stepsNote', 'הערה מתחת לשלבים / Note under the steps'),
    text('faqTitle', 'כותרת שאלות נפוצות / FAQ title'),
    objList('faq', 'שאלות ותשובות (אפשר להוסיף) / Questions and answers (you can add more)', [text('q', 'שאלה / Question'), area('a', 'תשובה / Answer', MARK)]),
    text('formTitle', 'כותרת הטופס / Form title'), area('formNote', 'שורה מעל הטופס / Line above the form', MARK),
  ]),
  page('accessibility', '♿ הצהרת נגישות / Accessibility', () => [...seo, text('title', 'כותרת / Title'), bgAlt, area('text', 'טקסט / Text', PARA + ' [[GENERIC]] / [[LEGAL]] = red marker')]),
  page('privacy', '🔒 מדיניות פרטיות / Privacy', () => [...seo, text('title', 'כותרת / Title'), bgAlt, area('text', 'טקסט / Text', PARA + ' [[GENERIC]] / [[LEGAL]] = red marker')]),
  page('donate', '💙 תרומות (כבוי) / Donate (off)', () => [...seo, text('title', 'כותרת / Title'), area('text', 'טקסט / Text')]),
];

// Fixed texts (menu, buttons, form, footer): fields are generated from ui.json itself, so they never go out of sync.
const fromJson = (o) => Object.entries(o).map(([k, v]) => (typeof v === 'object' && v !== null && !Array.isArray(v)
  ? { label: k, name: k, widget: 'object', collapsed: true, fields: fromJson(v) }
  : { label: k, name: k, widget: 'string', required: false }));
const ui = JSON.parse(fs.readFileSync('src/content/ui.json', 'utf8'));
const uiFields = (lang) => fromJson(ui[lang]);

const bg = (name, label) => img(name, `תמונת רקע: ${label}`, { required: true });
const settingsFields = [
  { label: 'הצג סימונים אדומים (TODO) / Show red TODO markers', name: 'showTodo', widget: 'boolean', default: true, hint: 'כבו לפני ההשקה / Turn OFF at launch' },
  { label: 'הפעל עמוד תרומות / Turn on the Donate page', name: 'donateEnabled', widget: 'boolean', default: false },
  { label: 'מספר המשפחות אומת ואושר / Family count verified', name: 'familyCountVerified', widget: 'boolean', default: false, hint: 'האתר אינו מציג מספר משפחות / The site shows no family number' },
  { label: 'המשפחות אישרו את פרטי הנופלים / Memorial approved by families', name: 'memorialApproved', widget: 'boolean', default: false },
  { label: 'תמונת הבית מורשית / Home photo is licensed', name: 'homePhotoLicensed', widget: 'boolean', default: false },
  text('siteUrl', 'כתובת האתר (https://...) / Site address'),
  text('phone', 'טלפון / וואטסאפ (מספר אחד) / Telephone / WhatsApp (one number)'),
  text('email', 'דוא״ל / Email'), text('instagram', 'אינסטגרם (קישור מלא) / Instagram URL'), text('facebook', 'פייסבוק (קישור מלא) / Facebook URL'),
  text('formAction', 'כתובת שירות הטפסים (משותפת לטופס הצטרפות ולצור קשר) / Form service URL (shared by Join and Contact)', { hint: 'למשל / e.g. https://formsubmit.co/ajax/you@example.com' }),
  { label: 'שם הגוף המשפטי / Legal entity name', name: 'legalName', widget: 'object', fields: [text('he', 'עברית'), text('en', 'English')] },
  bg('homeBackground', 'בית / Home'), bg('aboutBackground', 'מי אנחנו / About'), bg('visionBackground', 'החזון / Vision'),
  bg('communityBackground', 'הקהילה / Community'), bg('contactBackground', 'צור קשר / Contact'), bg('legalBackground', 'נגישות ופרטיות / Accessibility & Privacy'),
];

const config = {
  backend: { name: 'github', repo, branch: 'main', commit_messages: { create: 'Edit: create {{collection}} "{{slug}}"', update: 'Edit: update {{collection}} "{{slug}}"', delete: 'Edit: delete {{collection}} "{{slug}}"', uploadMedia: 'Edit: upload photo "{{path}}"', deleteMedia: 'Edit: delete photo "{{path}}"' } },
  local_backend: true,
  site_url: '/',
  locale: 'he',
  media_folder: 'public/photos',
  public_folder: '/photos',
  collections: [
    { name: 'pages', label: 'עמודים / Pages', files: pages },
    { name: 'site', label: '⚙️ הגדרות / Settings', files: [
      filesEntry('settings.json', '⚙️ הגדרות כלליות, קשר ותמונות רקע / General settings, contact, backgrounds', settingsFields),
      { name: 'ui', label: '🔤 טקסטים קבועים (תפריט, טופס, תחתית) / Menus, form, footer text', file: 'src/content/ui.json', fields: bilingual(uiFields) },
    ] },
  ],
};
fs.mkdirSync('public/admin', { recursive: true });
fs.writeFileSync('public/admin/config.yml', '# Generated by scripts/build-cms-config.mjs - do not edit by hand\n' + y(config) + '\n');
console.log('CMS config written');
