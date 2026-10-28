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
    document.documentElement.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => set(menuBtn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); menuBtn.focus(); } });
  // back to the desktop layout: make sure the page can scroll again
  matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) set(false); });
}

/* ---------- language preference ---------- */
$$('[data-lang-toggle]').forEach((a) => a.addEventListener('click', () => store.set('lang', a.dataset.langToggle || '')));
const offer = $('[data-lang-offer]');
if (offer && !store.get('lang') && /^en/i.test(navigator.language || '')) {
  offer.hidden = false;
  $('[data-lang-offer-close]', offer)?.addEventListener('click', () => { store.set('lang', 'he'); offer.hidden = true; });
}
if (!store.get('lang')) store.set('lang', document.documentElement.lang);

/* ---------- background photo darkens gently as you scroll ---------- */
const bg = $('[data-bg]');
if (bg && !reduced) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const h = window.innerHeight || 800;
    bg.style.setProperty('--p', Math.min(1, Math.max(0, window.scrollY / (h * 0.85))).toFixed(3));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
}

/* ---------- fade-up on scroll ---------- */
const reveals = $$('[data-reveal]');
if (reveals.length) {
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach((el) => el.classList.add('in'));
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  }
}

/* ---------- floating WhatsApp button steps aside while a form's buttons are on screen ---------- */
const fab = $('[data-fab]');
const submits = $$('[data-submit]');
if (fab && submits.length && 'IntersectionObserver' in window) {
  const seen = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
    fab.classList.toggle('is-hidden', seen.size > 0);
  }, { rootMargin: '0px 0px 80px 0px' });
  submits.forEach((el) => io.observe(el));
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

/* ---------- forms (join + contact) ---------- */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s\-().]{7,}$/;
$$<HTMLFormElement>('[data-form]').forEach((form) => {
  const kind = form.dataset.form as 'join' | 'contact';
  const d = form.dataset;
  const status = $('[data-status]', form)!;
  const summary = $('[data-summary]', form)!;
  const summaryList = $('[data-summary-list]', form)!;
  const thanks = $('[data-thanks]', form)!;
  const submit = $<HTMLButtonElement>('[data-submit]', form)!;
  const val = (n: string) => ((form.elements.namedItem(n) as HTMLInputElement | null)?.value || '').trim();
  const msg: Record<string, string> = {
    name: d.errName!, contact: d.errContact!, email: d.errEmail!, phone: d.errPhone!, emailorphone: d.errEmailorphone!,
    family: d.errFamily!, message: d.errMessage!, consent: d.errConsent!,
  };
  const target = (k: string) => $<HTMLElement>(`[data-field="${k}"]`, form) || $<HTMLElement>('[data-field="phone"]', form);

  const next = $<HTMLInputElement>('[data-next]', form);
  if (next) next.value = location.origin + location.pathname + '?sent=1';
  const done = () => { form.classList.add('is-done'); thanks.hidden = false; thanks.focus(); };
  if (new URLSearchParams(location.search).get('sent') === '1') done();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!val('name')) errs.name = msg.name;
    if (kind === 'join') {
      const phone = val('phone'), email = val('email'), fam = val('family_members');
      if (!phone && !email) errs.contact = msg.contact;
      if (phone && !PHONE.test(phone)) errs.phone = msg.phone;
      if (email && !EMAIL.test(email)) errs.email = msg.email;
      if (fam && !(Number(fam) >= 1 && Number(fam) <= 30)) errs.family = msg.family;
    } else {
      const c = val('email_or_phone');
      if (!c || !(EMAIL.test(c) || PHONE.test(c))) errs.contact = msg.emailorphone;
      if (!val('message')) errs.message = msg.message;
    }
    if (!(form.elements.namedItem('consent') as HTMLInputElement).checked) errs.consent = msg.consent;
    return errs;
  };
  const show = (errs: Record<string, string>) => {
    $$('[data-err]', form).forEach((p) => { p.hidden = true; p.textContent = ''; });
    $$('input,select,textarea', form).forEach((i) => i.removeAttribute('aria-invalid'));
    summaryList.innerHTML = '';
    Object.entries(errs).forEach(([k, m]) => {
      const p = $(`[data-err="${k}"]`, form)!;
      p.textContent = m; p.hidden = false;
      const el = target(k);
      el?.setAttribute('aria-invalid', 'true');
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + (el?.id || ''); a.textContent = m;
      a.addEventListener('click', (e) => { e.preventDefault(); el?.focus(); });
      li.appendChild(a); summaryList.appendChild(li);
    });
    summary.hidden = Object.keys(errs).length === 0;
  };
  const say = (text: string, ok: boolean) => { status.textContent = text; status.hidden = false; status.dataset.ok = String(ok); status.focus(); };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.hidden = true;
    const errs = validate();
    show(errs);
    if (Object.keys(errs).length) { summary.focus(); return; }
    if (!d.action) {
      if (d.demo) { done(); form.reset(); } else say(d.msgFailure!, false);
      return;
    }
    const label = submit.textContent;
    submit.disabled = true; submit.textContent = d.sending || label;
    try {
      const res = await fetch(d.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset(); done();
    } catch { say(d.msgFailure!, false); }
    finally { submit.disabled = false; submit.textContent = label; }
  });
});

/* ---------- slides viewer (full-page, close with X, Esc or a click on the dark area) ---------- */
const slideBox = $<HTMLDialogElement>('[data-slides]');
if (slideBox) {
  const list: { src: string; alt: string }[] = JSON.parse(slideBox.dataset.list || '[]');
  const img = $<HTMLImageElement>('[data-slides-img]', slideBox)!;
  const count = $('[data-slides-count]', slideBox)!;
  const rtl = document.documentElement.dir === 'rtl';
  let i = 0;
  const show = (n: number) => {
    i = (n + list.length) % list.length;
    img.src = list[i].src;
    img.alt = list[i].alt;
    count.textContent = (slideBox.dataset.counter || '').replace('{n}', String(i + 1)).replace('{total}', String(list.length));
    const next = new Image(); next.src = list[(i + 1) % list.length].src; // warm the next one
  };
  const open = (opener: HTMLElement) => { show(0); slideBox.showModal(); document.documentElement.classList.add('slides-open'); (slideBox as any)._opener = opener; };
  const close = () => slideBox.close();
  $$('[data-slides-open]').forEach((b) => b.addEventListener('click', () => open(b)));
  $('[data-slides-close]', slideBox)!.addEventListener('click', close);
  $('[data-slides-prev]', slideBox)!.addEventListener('click', () => show(i - 1));
  $('[data-slides-next]', slideBox)!.addEventListener('click', () => show(i + 1));
  slideBox.addEventListener('click', (e) => { if (e.target === slideBox) close(); });
  slideBox.addEventListener('close', () => { document.documentElement.classList.remove('slides-open'); ((slideBox as any)._opener as HTMLElement | undefined)?.focus(); });
  slideBox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(i + (rtl ? -1 : 1));
    else if (e.key === 'ArrowLeft') show(i + (rtl ? 1 : -1));
  });
  // swipe
  let x0 = 0;
  slideBox.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  slideBox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(i + ((dx < 0) !== rtl ? 1 : -1));
  });
}
