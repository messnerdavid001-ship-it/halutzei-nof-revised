# TODO.md — open items for Halutzei Nof

Red markers on the site (shown while **Show red TODO markers** is ON in CMS → Settings).
A marker disappears on its own once the matching value is filled in / confirmed in Settings.

## Red markers on the site

| # | Item | Where it appears | How it is cleared |
|---|---|---|---|
| 1 | Home photo is not licensed | Marker hidden at your request ("Home photo is licensed" is ticked) — the photo is still NOT licensed | Replace `home-village.jpg` with a licensed photo. To bring the marker back, untick "Home photo is licensed" |
| 2 | **Placeholder copy — final wording needed** | End of most text blocks on every page (he + en) | Write the final wording, delete `[[DRAFT]]` from the text. Prompt B copy replaces these. |
| 3 | Memorial details need the families' approval | About → "In Their Memory" (he + en) | Fill in the six cards, then tick "Memorial approved" |
| 4 | Telephone / WhatsApp number | Footer + Contact | Done: 053-474-9499 (one field for both) |
| 5 | Email address | Footer + Contact | Settings → Email |
| 6 | Instagram link | Done: instagram.com/halutzei_nof | — |
| 7 | Facebook link | Done | — |
| 8 | Form destination | Under the Join and Contact forms (cleared: both send to 123messner@gmail.com via FormSubmit; first test submission of each must be confirmed by email) | Settings → Form service URL |
| 9 | Legal entity name / legal status | Footer copyright line, Accessibility Statement, Privacy Policy | Settings → Legal entity name |
| 10 | Template text to complete ("to be completed") | Accessibility Statement (coordinator name/phone/email, date), Privacy Policy (entity details, form provider, retention, privacy contact) | Edit the text in CMS → Pages |

## Bookmarks: what a visitor will wonder (blue markers on the site)

These are ideas from looking at a similar site (or1.org.il) and imagining a family reading ours. Each one is a **blue** marker on the page, shown only while "Show red TODO markers" is on. Delete the `[[BM#]]` code from the text once you have decided.

| # | Where | What a visitor will wonder | Suggested change | Your decision |
|---|---|---|---|---|
| BM1 | Join → FAQ "How do you join?" | How soon will someone answer me? | Say a realistic reply time, e.g. "within a few days". | The time you can really keep |
| BM2 | Join → FAQ "How do you join?" | Does leaving details commit me or cost money? | Add a question "Does leaving details commit me or cost anything?" with the answer. | Confirm the answer |
| BM3 | Join → FAQ "Who is it for?" | I live abroad. Will you help with aliyah? | One clear sentence on what you do and do not offer. The brief says make no promises of services. | The wording |
| BM4 | Community → Education | What is daily life like: Shabbat, kashrut, synagogue? | One short, honest paragraph. Today the site only says "no coercion". | The wording |
| BM5 | Join → FAQ "How do you join?" | Where is it? | Answer without revealing anything, e.g. details are shared in personal conversations as things develop. Must be true. | Whether to answer at all, and how |
| BM6 | About → Our Community | Who is behind this, with no names shown? | Another trust signal: the legal entity name (Settings), or a line on how the community is organised. | Which one |
| BM7 | Join → above the form | I'm not ready to join, but I want updates. | An "updates only" checkbox, or a pointer to Instagram and Facebook. | Which one |
| BM8 | Join → under the four steps | Can I meet you before I decide? | One sentence about introductory meetings or video calls. Events were removed, so this is a sentence, not a calendar. | Whether you offer it |

## Changes made on branch version-2, inspired by the reference site

- **Menu 8 → 5 items** (plus the gold Join button): Home, About, Vision, Community, Contact. Vision and Values were merged because values are how the vision is lived. Community and Education were merged because education is part of family life. FAQ moved into the Join page (and stays in the footer) because it answers "how do I join?".
- **Short summaries:** one overview sentence on Home that joins three pairs of ideas; short pillar cards (a 2–4 word title and one line); a one-line summary under every page title; a "Who the community is for" block on Home.
- **Removed pages:** `/values/`, `/education/`, `/faq/`. Nothing links to them yet, so no redirects were added. Add redirects if the old addresses are ever published.

## Needs your input

- [ ] **Memorial stories** — names, photos, text for the six cards, and the families' approval. Decision: the six names and photos stay visible on the About page even before approval; the "Memorial approved" switch only controls the red note.
- [ ] **Final copy** — all page text is placeholder (red marker 2) until the wording prompt (Prompt B) is applied.
- [ ] **Legal entity name** — Settings → Legal entity name (he + en). Hidden in the footer while empty.
- [ ] **Licensed home photo** — replace `public/photos/home-village.jpg`.
- [ ] **Higher-resolution `about-soldiers.jpg`** — current file is 1026×744 and looks soft on large screens (full-screen background on About).
- [ ] **Join and Contact forms** — send one test message from each, then click the FormSubmit activation link. Consider a role address instead of a personal one.
- [ ] **Legal review** of the Accessibility Statement and Privacy Policy templates (Israeli law; IS 5568). The Privacy Policy now describes both forms.
- [ ] **Open Graph image** — currently the Home photo; consider a dedicated 1200×630 image.
- [ ] **Photos and location** — check that no background photo could reveal the future location before going public.

## Decisions still open (not shown on the site)

- [ ] **Hosting** — local only for now. Nothing is pushed or published. `deploy/github-pages-deploy.yml` is left untouched. GitHub Pages needs a public repository on a free account; decide that, or another host, later.
- [ ] **Custom domain** — not chosen. Then fill in Settings → Site address (sitemap, hreflang and share image need full addresses).
- [ ] **Admin sign-in when hosted** — uses a GitHub personal access token (works for one editor). Local editing needs no sign-in.
- [ ] **Donate page** — keep OFF until the legal framework and donation mechanism exist. It is excluded from the menu and sitemap.
- [ ] **Lighthouse** — mobile Performance and Accessibility should be re-checked once the final copy and licensed photo are in.

## Done in this rebuild

- Pages: Home, About (with memorial), Vision, Values (9 cards), Community, Education, Join (4 steps + form), FAQ, Contact; Accessibility and Privacy in the footer.
- Events feature removed; no family number anywhere on the site.
- Every page has a selectable full-screen background photo (CMS → Settings).
- Floating WhatsApp button (bottom-left in Hebrew, bottom-right in English).
