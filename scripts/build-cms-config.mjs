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
const MARK = 'טיפ: [[FAMILY]] מוסיף סימון אדום "מספר משפחות לא מאומת" / Tip: [[FAMILY]] inserts the red family-count marker. Blank line = new paragraph.';
const PARA = 'שורה ריקה = פסקה חדשה / A blank line starts a new paragraph.';

const filesEntry = (file, label, fields) => ({ name: file.split('/').pop().replace('.json', ''), label, file: `src/content/${file}`, fields });
const page = (key, label, fnFields) => filesEntry(`pages/${key}.json`, label, bilingual(fnFields));

const pages = [
  page('home', '🏠 בית / Home', () => [
    ...seo, text('tagline', 'משפט פתיחה / Tagline'), text('backgroundAlt', 'תיאור התמונה (נגישות) / Photo description (alt)'),
    text('introTitle', 'כותרת מבוא / Intro title'), area('intro', 'טקסט מבוא / Intro text', MARK),
    objList('photos', 'תמונות מתחת לאזור הראשי (עד 2) / Photos below the intro (up to 2)', [img('image', 'תמונה / Photo'), text('alt', 'תיאור התמונה / Alt text')]),
  ]),
  page('about', '👥 אודות / About', () => [
    ...seo, text('title', 'כותרת / Title'), text('backgroundAlt', 'תיאור תמונת הרקע / Background alt'),
    text('storyTitle', 'כותרת הסיפור / Story title'), area('story', 'הסיפור / Story', MARK),
    text('memorialTitle', 'כותרת לזכרם / Memorial title'), text('memorialTag', 'שורה קטנה בתחתית כל כרטיס / Small line at the bottom of each card'), area('memorialIntro', 'פתיח לזכרם / Memorial intro'),
    objList('memorials', 'הנופלים (6) / The fallen (6)', [text('name', 'שם / Name'), area('text', 'טקסט קצר / Short text'), img('photo', 'תמונה / Photo'), text('photoAlt', 'תיאור התמונה / Alt text')]),
  ]),
  page('vision', '🌄 החזון / Vision', () => [
    ...seo, text('title', 'כותרת / Title'), text('backgroundAlt', 'תיאור תמונת הרקע / Background alt'), area('intro', 'מבוא / Intro'),
    text('valuesTitle', 'כותרת ערכים / Values title'), objList('values', 'ערכים / Values', [text('title', 'כותרת / Title'), area('text', 'טקסט / Text')]),
    text('futureTitle', 'כותרת העתיד / Future title'), area('goal', 'היעד (כ-85 משפחות) / Goal'),
    text('elementsTitle', 'כותרת רעיונות / Ideas title'), list('elements', 'רעיונות לטווח ארוך / Long-term ideas'),
    text('disclaimer', 'הבהרה / Disclaimer'), area('economy', 'בסיס כלכלי / Economic foundation'),
  ]),
  page('community', '🤝 הקהילה / Community', () => [
    ...seo, text('title', 'כותרת / Title'), text('backgroundAlt', 'תיאור תמונת הרקע / Background alt'),
    text('fitTitle', 'כותרת "מי מתאים" / Fit title'), area('fit', 'מי מתאים / Who is a good fit', PARA),
    text('audienceTitle', 'כותרת קהלי יעד / Audience title'), list('audience', 'קהלי יעד / Audience'),
    text('processTitle', 'כותרת היכרות / Process title'), area('process', 'תהליך ההיכרות / Process'),
    text('commitmentTitle', 'כותרת מחויבות / Commitment title'), area('commitment', 'מחויבות / Commitment'),
    text('eventsTitle', 'כותרת אירועים / Events title'), area('eventsEmpty', 'הודעה כשאין אירועים / Empty-state message'),
    text('ctaTitle', 'כותרת הזמנה / CTA title'), area('ctaText', 'טקסט הזמנה / CTA text'),
  ]),
  page('partners', '🌐 שותפים לדרך / Partners', () => [
    ...seo, text('title', 'כותרת / Title'), area('intro', 'מבוא / Intro'),
    text('whoTitle', 'כותרת "אל מי" / Who title'), list('who', 'גופים / Bodies'),
    text('kindsTitle', 'כותרת סוגי שיתוף / Kinds title'), list('kinds', 'סוגי שיתוף פעולה / Kinds of collaboration'),
    area('disclaimer', 'הבהרה (אין שותפות קיימת) / Disclaimer'), area('ctaText', 'טקסט קריאה לפעולה / CTA text'),
  ]),
  page('contact', '✉️ צור קשר / Contact', () => [...seo, text('title', 'כותרת / Title'), area('intro', 'מבוא / Intro')]),
  page('accessibility', '♿ הצהרת נגישות / Accessibility', () => [...seo, text('title', 'כותרת / Title'), area('text', 'טקסט / Text', PARA + ' [[GENERIC]] / [[LEGAL]] = red marker')]),
  page('privacy', '🔒 מדיניות פרטיות / Privacy', () => [...seo, text('title', 'כותרת / Title'), area('text', 'טקסט / Text', PARA + ' [[GENERIC]] / [[LEGAL]] = red marker')]),
  page('donate', '💙 תרומות (כבוי) / Donate (off)', () => [...seo, text('title', 'כותרת / Title'), area('text', 'טקסט / Text')]),
];

const t = (key, label) => ({ label, name: key, widget: 'string', required: false });
const uiFields = (lang) => [
  t('siteName', 'שם האתר'), t('skip', 'דלג לתוכן'), t('btnJoin', 'כפתור: אני רוצה להצטרף'), t('btnPartners', 'כפתור: שותפים לדרך'),
  t('btnContactPartners', 'כפתור: צרו קשר (שותפים)'), t('btnJoinCommunity', 'כפתור: הצטרפות (קהילה)'),
  { label: 'תפריט / Menu', name: 'nav', widget: 'object', fields: ['home', 'about', 'vision', 'community', 'partners', 'contact'].map((k) => t(k, k)) },
  { label: 'כותרת תחתית / Footer', name: 'footer', widget: 'object', fields: ['contactTitle', 'phone', 'email', 'instagram', 'facebook', 'accessibility', 'privacy', 'copyright'].map((k) => t(k, k)) },
  { label: 'מילוי מקום / Placeholders', name: 'placeholders', widget: 'object', fields: ['phone', 'email', 'instagram', 'facebook', 'legalName'].map((k) => t(k, k)) },
  { label: 'סימונים אדומים / Red markers', name: 'todo', widget: 'object', fields: ['photo', 'family', 'memorial', 'phone', 'email', 'instagram', 'facebook', 'form', 'formDemo', 'legal', 'generic'].map((k) => t(k, k)) },
  { label: 'טופס / Form', name: 'form', widget: 'object', fields: ['title', 'name', 'phone', 'email', 'contactHint', 'type', 'typeJoin', 'typePartner', 'typeGeneral', 'message', 'consent', 'consentLink', 'required', 'submit', 'errName', 'errContact', 'errEmail', 'errPhone', 'errConsent', 'errorSummary', 'success', 'failure'].map((k) => t(k, k)) },
  { label: 'אירועים / Events', name: 'events', widget: 'object', fields: ['date', 'place'].map((k) => t(k, k)) },
  { label: 'תפריט נגישות / Accessibility menu', name: 'a11y', widget: 'object', fields: ['button', 'title', 'close', 'bigger', 'smaller', 'contrast', 'underline', 'reset'].map((k) => t(k, k)) },
  { label: 'עמוד 404', name: 'notFound', widget: 'object', fields: ['title', 'text', 'back'].map((k) => t(k, k)) },
  t('logoAlt', 'תיאור הלוגו (alt)'), t('menuOpen', 'פתח תפריט'), t('menuClose', 'סגור תפריט'),
];

const settingsFields = [
  { label: 'הצג סימונים אדומים (TODO) / Show red TODO markers', name: 'showTodo', widget: 'boolean', default: true, hint: 'כבו לפני ההשקה / Turn OFF at launch' },
  { label: 'הפעל עמוד תרומות / Turn on the Donate page', name: 'donateEnabled', widget: 'boolean', default: false },
  { label: 'מספר המשפחות אומת ואושר / Family count verified', name: 'familyCountVerified', widget: 'boolean', default: false },
  { label: 'המשפחות אישרו את פרטי הנופלים / Memorial approved by families', name: 'memorialApproved', widget: 'boolean', default: false },
  { label: 'תמונת הבית מורשית / Home photo is licensed', name: 'homePhotoLicensed', widget: 'boolean', default: false },
  text('siteUrl', 'כתובת האתר (https://...) / Site address'),
  text('phone', 'טלפון / וואטסאפ (מספר אחד) / Telephone / WhatsApp (one number)'),
  text('email', 'דוא״ל / Email'), text('instagram', 'אינסטגרם (קישור מלא) / Instagram URL'), text('facebook', 'פייסבוק (קישור מלא) / Facebook URL'),
  text('formAction', 'כתובת שירות הטפסים / Form service URL', { hint: 'למשל / e.g. https://formspree.io/f/xxxx' }),
  { label: 'שם הגוף המשפטי / Legal entity name', name: 'legalName', widget: 'object', fields: [text('he', 'עברית'), text('en', 'English')] },
  img('homeBackground', 'תמונת רקע: בית / Home background', { required: true }),
  img('aboutBackground', 'תמונת רקע: אודות / About background', { required: true }),
  img('visionBackground', 'תמונת רקע: החזון / Vision background', { required: true }),
  img('communityBackground', 'תמונת רקע: הקהילה / Community background', { required: true }),
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
    { name: 'events', label: '📅 אירועים / Events', label_singular: 'אירוע / Event', folder: 'src/content/events', extension: 'json', format: 'json', create: true, slug: '{{year}}-{{month}}-{{day}}-{{slug}}',
      summary: '{{title_he}} — {{date}}',
      fields: [text('title_he', 'כותרת (עברית)', { required: true }), text('title_en', 'Title (English)'), { label: 'תאריך / Date', name: 'date', widget: 'datetime', time_format: false, date_format: 'YYYY-MM-DD', format: 'YYYY-MM-DD' },
        text('place_he', 'מקום (עברית)'), text('place_en', 'Place (English)'), area('description_he', 'תיאור (עברית)'), area('description_en', 'Description (English)'),
        img('photo', 'תמונה (לא חובה) / Photo (optional)'), text('photoAlt_he', 'תיאור התמונה (עברית)'), text('photoAlt_en', 'Photo description (English)')] },
    { name: 'site', label: '⚙️ הגדרות / Settings', files: [
      filesEntry('settings.json', '⚙️ הגדרות כלליות, קשר ותמונות רקע / General settings, contact, backgrounds', settingsFields),
      { name: 'ui', label: '🔤 טקסטים קבועים (תפריט, טופס, תחתית) / Menus, form, footer text', file: 'src/content/ui.json', fields: bilingual(uiFields) },
    ] },
  ],
};
fs.mkdirSync('public/admin', { recursive: true });
fs.writeFileSync('public/admin/config.yml', '# Generated by scripts/build-cms-config.mjs - do not edit by hand\n' + y(config) + '\n');
console.log('CMS config written');
