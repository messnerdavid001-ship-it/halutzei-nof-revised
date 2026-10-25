# Halutzei Nof website — guide for Dave

You do not need to code. Everything you will want to change is in the **admin panel**:

**`https://YOUR-SITE-ADDRESS/admin/`**

How it works, in one line: when you press **Publish** in the admin panel, your edit is saved as a **commit on GitHub**, and GitHub then rebuilds and publishes the site by itself in about **1–2 minutes**. There is no other hosting company involved. Every edit is in the GitHub history, so anything can be undone.

---

## 1. Log in and edit text

1. Go to `/admin/` and click **Sign in with token** (see "First-time setup" below for how to make the token once; the browser remembers it).
3. On the left you will see:
   - **עמודים / Pages** — Home, About, Vision, Community, Contact, Accessibility, Privacy.
   - **אירועים / Events** — the events list on the Community page.
   - **הגדרות / Settings** — contact details, background photos, on/off switches, and the fixed texts (menu, buttons, form, footer).
4. Click a page. You will see two boxes: **עברית (Hebrew)** and **English**. Every sentence on the page is in one of these fields.
5. Change the text, then press **Save** (top right). Saving = publishing: the edit is committed to GitHub and the site rebuilds.

Tips
- A **blank line** inside a long text starts a new paragraph.
- Do not delete things written like `[[FAMILY]]`. That is what shows the small red note next to the "about 10 families" figure. It disappears by itself when you tick "Family count verified" in Settings.
- The name is always written **Halutzei Nof** in English. Do not translate it.

## 2. Change a photo

**Background photos (Home, About, Vision, Community):**
1. Admin → **הגדרות / Settings** → **הגדרות כלליות…**
2. Scroll to "תמונת רקע / Background".
3. Click the photo → **Choose different image** → upload a new one → **Publish**.
   - Use a large, sharp image (at least 1600 pixels wide). A horizontal photo works best for Home, About and Community; a vertical one for Vision.

**Photos on the Home page (below the text):** Admin → Pages → Home → "Photos below the intro" → add a photo and a short description of what is in it (for people who use screen readers).

**Memorial photos:** Admin → Pages → About → "The fallen" → choose each person's photo.

The site shrinks and converts photos automatically — you do not need to resize them.

## 3. Add or remove an event

1. Admin → **אירועים / Events** → **New Event**.
2. Fill in the title (Hebrew and English), the date, the place and a short description. A photo is optional.
3. **Publish.** It appears on the Community page.
4. To remove an event: open it, then **Delete entry**. Old events are not removed automatically, so delete them once they have passed.

When there are no events, the page shows a friendly "no events right now" message (you can edit that message in Pages → Community).

## 4. Remove the red TODO markers

The red notes are reminders for you. Each one disappears by itself when the thing it asks for is done:

| Red note | What makes it disappear |
|---|---|
| Photo not licensed | Replace the Home photo, tick "Home photo is licensed" |
| Family count not verified | Tick "Family count verified" |
| Awaiting families' approval | Tick "Memorial approved" |
| Phone / email / Instagram / Facebook | Type the real value in Settings |
| Contact form destination | Paste the form service address in Settings |
| Legal entity name | Type the name in Settings |

**To hide ALL red notes at once** (for example on launch day): Admin → Settings → turn **off** "Show red TODO markers" → Publish.

Important: if you hide all the notes while a phone number or email is still empty, that line simply disappears from the page instead of showing "[Phone number]". The full list of open items is in `TODO.md`.

## 5. Turn on the Donate page later

The Donate page exists but is **off**. It is not in the menu and not shown to Google. Please turn it on only after the legal framework and the donation method are in place.

1. Write the text: Admin → Pages → **תרומות / Donate**.
2. Admin → Settings → turn **on** "Turn on the Donate page" → Publish.
3. The page appears at `/donate/` (Hebrew) and `/en/donate/` (English). It will still not appear in the menu. Ask your helper to add a link when you are ready.

## 6. Connect your own domain later

1. Buy a domain from any registrar (for example `halutzeinof.org.il`).
2. On GitHub: repository → **Settings → Pages → Custom domain** → type the domain → Save. GitHub shows the DNS records to add at the registrar (and gives a free HTTPS certificate).
3. Add a file named `CNAME` in the `public` folder of the repository containing just the domain (your helper can do this in 2 minutes). From then on the site is built for the root of the domain automatically.
4. Admin → Settings → "Site address" → type `https://your-domain` → Save.

## 7. The contact form

The form sends each message to **123messner@gmail.com** through a free service called **FormSubmit**.

- **First time only:** open the live site, send one test message, then check that Gmail inbox. FormSubmit emails an **activation link** — click it. After that every message arrives as a normal email (also check Spam the first time).
- **To send messages somewhere else or to use another service** (Formspree, Web3Forms...): Admin → Settings → "Form service URL" → paste the new address → Save.
- Note: the destination email is visible in the site's code. Expect some spam, and consider a dedicated address (like contact@yourdomain) later.
- Remember to complete the Privacy Policy details (how long messages are kept, who to contact) before launch.

## 8. First-time setup (only once)

Hosting and editing both run on **GitHub** (free). Already done by Claude when the repository was created. You only need to:

1. **Create your editing token** (this replaces a password):
   - GitHub → your profile picture → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
   - Name: `halutzei-nof admin`. Expiration: the longest allowed. **Repository access: only select repositories → halutzei-nof.**
   - Permissions → Repository permissions → **Contents: Read and write** (and Metadata: Read).
   - Generate, **copy the token** and keep it somewhere safe (a password manager).
2. Open `https://YOUR-SITE-ADDRESS/admin/` → **Sign in with token** → paste it. Done. Do not share the token; if it leaks, delete it on the same GitHub page and make a new one.
3. When the token expires (GitHub emails you), repeat step 1.

Later, if other people should edit, ask your helper to set up the free GitHub login button for the admin panel (a small one-time job) so nobody needs tokens.

## 9. Who to ask for help, and what to tell them

Ask any web developer who knows **Astro** and **GitHub Actions** (a few hours of work for anything in this guide).

Send them:
- The GitHub repository link.
- This text: **"Astro static site on GitHub Pages, deployed by `.github/workflows/deploy.yml` on every push to main. Admin at /admin is Sveltia CMS (Decap-compatible) with the GitHub backend; content is JSON files in `src/content`; the CMS config is generated by `scripts/build-cms-config.mjs`."**
- What you want to change, and a link to the page.

If something looks wrong after you publish, tell them the time and what you changed — every edit is a commit in the repository history and can be reverted in one step. You can also see build status in the repository's **Actions** tab (a red ✗ means the last edit did not publish; the site keeps showing the previous version).
