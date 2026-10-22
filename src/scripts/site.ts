const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- mobile menu ---------- */
const menuBtn = $<HTMLButtonElement>('[data-menu-btn]');
const nav = $('[data-nav]');
if (menuBtn && nav) {
  const set = (open: boolean) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', menuBtn.dataset[open ? 'close' : 'open'] || '');
    nav.classList.toggle('open', open);
  };
  menuBtn.addEventListener('click', () => set(menuBtn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); menuBtn.focus(); } });
}

/* ---------- language preference ---------- */
$$('[data-lang-toggle]').forEach((a) => a.addEventListener('click', () => store.set('lang', a.dataset.langToggle || '')));
const offer = $('[data-lang-offer]');
if (offer && !store.get('lang') && /^en/i.test(navigator.language || '')) {
  offer.hidden = false;
  $('[data-lang-offer-close]', offer)?.addEventListener('click', () => { store.set('lang', 'he'); offer.hidden = true; });
}
if (!store.get('lang')) store.set('lang', document.documentElement.lang);

/* ---------- scroll blur / darken of the fixed background photo ---------- */
const bg = $('[data-bg]');
if (bg && !reduced) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const h = window.innerHeight || 800;
    const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.85)));
    bg.style.setProperty('--p', p.toFixed(3));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
}

/* ---------- accessibility menu ---------- */
const a11y = $('[data-a11y]');
if (a11y) {
  const btn = $<HTMLButtonElement>('[data-a11y-btn]', a11y)!;
  const panel = $('[data-a11y-panel]', a11y)!;
  const root = document.documentElement;
  let prefs: { fs?: number; hc?: boolean; ul?: boolean } = {};
  try { prefs = JSON.parse(store.get('a11y') || '{}'); } catch { /* ignore */ }
  const apply = () => {
    root.style.fontSize = prefs.fs ? prefs.fs + '%' : '';
    root.classList.toggle('hc', !!prefs.hc);
    root.classList.toggle('ul', !!prefs.ul);
    $('[data-a11y-act="contrast"]', a11y)?.setAttribute('aria-pressed', String(!!prefs.hc));
    $('[data-a11y-act="underline"]', a11y)?.setAttribute('aria-pressed', String(!!prefs.ul));
    store.set('a11y', JSON.stringify(prefs));
  };
  const toggle = (open: boolean) => { panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
  btn.addEventListener('click', () => toggle(panel.hidden));
  a11y.addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Escape') { toggle(false); btn.focus(); } });
  $$('[data-a11y-act]', a11y).forEach((b) =>
    b.addEventListener('click', () => {
      const act = b.dataset.a11yAct;
      if (act === 'bigger') prefs.fs = Math.min(150, (prefs.fs || 100) + 10);
      else if (act === 'smaller') prefs.fs = Math.max(80, (prefs.fs || 100) - 10);
      else if (act === 'contrast') prefs.hc = !prefs.hc;
      else if (act === 'underline') prefs.ul = !prefs.ul;
      else if (act === 'reset') prefs = {};
      else if (act === 'close') { toggle(false); btn.focus(); return; }
      apply();
    })
  );
  apply();
}

/* ---------- contact form ---------- */
const form = $<HTMLFormElement>('[data-form]');
if (form) {
  const d = form.dataset;
  const q = new URLSearchParams(location.search).get('type');
  const typeSel = form.elements.namedItem('type') as HTMLSelectElement;
  if (q && ['join', 'partner', 'general'].includes(q)) typeSel.value = q;

  const status = $('[data-status]', form)!;
  const summary = $('[data-summary]', form)!;
  const summaryList = $('[data-summary-list]', form)!;
  const val = (n: string) => ((form.elements.namedItem(n) as HTMLInputElement).value || '').trim();
  const fieldFor = (k: string) => ({ name: 'f-name', phone: 'f-phone', email: 'f-email', contact: 'f-phone', consent: 'f-consent' } as Record<string, string>)[k];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!val('name')) errs.name = d.errName!;
    const phone = val('phone'), email = val('email');
    if (!phone && !email) errs.contact = d.errContact!;
    if (phone && !/^\+?[\d\s\-().]{7,}$/.test(phone)) errs.phone = d.errPhone!;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = d.errEmail!;
    if (!(form.elements.namedItem('consent') as HTMLInputElement).checked) errs.consent = d.errConsent!;
    return errs;
  };
  const show = (errs: Record<string, string>) => {
    $$('[data-err]', form).forEach((p) => { p.hidden = true; p.textContent = ''; });
    $$('input,select,textarea', form).forEach((i) => i.removeAttribute('aria-invalid'));
    summaryList.innerHTML = '';
    Object.entries(errs).forEach(([k, m]) => {
      const p = $(`[data-err="${k}"]`, form)!;
      p.textContent = m; p.hidden = false;
      document.getElementById(fieldFor(k))?.setAttribute('aria-invalid', 'true');
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + fieldFor(k); a.textContent = m;
      a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(fieldFor(k))?.focus(); });
      li.appendChild(a); summaryList.appendChild(li);
    });
    summary.hidden = Object.keys(errs).length === 0;
  };
  const say = (msg: string, ok: boolean) => {
    status.textContent = msg; status.hidden = false; status.dataset.ok = String(ok); status.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.hidden = true;
    const errs = validate();
    show(errs);
    if (Object.keys(errs).length) { summary.focus(); return; }
    if (!d.action) {
      // No form service connected yet.
      if (d.demo) { say(`${d.msgSuccess} [${d.msgDemo}]`, true); form.reset(); }
      else say(d.msgFailure!, false);
      return;
    }
    try {
      const res = await fetch(d.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      say(d.msgSuccess!, true); form.reset();
    } catch { say(d.msgFailure!, false); }
  });
}
