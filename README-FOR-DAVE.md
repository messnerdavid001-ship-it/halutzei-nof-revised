# Halutzei Nof website — guide for Dave

You do not need to code. Everything you will want to change is in the **admin panel** at:

**`https://YOUR-SITE-ADDRESS/admin`**

(Replace `YOUR-SITE-ADDRESS` with the temporary address you were given, for example `halutzei-nof.netlify.app`.)

After you press **Publish** in the admin panel, the site updates by itself in about **1–2 minutes**. Nothing you do there can break the site: every change is saved with a history and can be undone by the person who helps you (see the last section).

---

## 1. Log in and edit text

1. Go to `/admin` and click **Login**.
2. Enter your email and password. (The first time, use the invitation email — see "First-time setup" below.)
3. On the left you will see:
   - **עמודים / Pages** — Home, About, Vision, Community, Partners, Contact, Accessibility, Privacy.
   - **אירועים / Events** — the events list on the Community page.
   - **הגדרות / Settings** — contact details, background photos, on/off switches, and the fixed texts (menu, buttons, form, footer).
4. Click a page. You will see two boxes: **עברית (Hebrew)** and **English**. Every sentence on the page is in one of these fields.
5. Change the text, then press **Save** and **Publish → Publish now** (top right).

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

1. Buy a domain from any registrar (for example `halutzeinof.org.il` or `.co.il`).
2. In **Netlify** (where the site lives): **Domain management → Add a domain** and follow the steps. Netlify tells you exactly which records to add at the registrar. This usually takes from a few minutes to a day.
3. Netlify gives you a free HTTPS certificate automatically.
4. Then: Admin → Settings → "Site address" → type the new address (for example `https://halutzeinof.org.il`) → Publish. (This helps Google understand the Hebrew and English versions.)

## 7. The contact form

At the moment the form is **not connected**: visitors can fill it in but nothing is sent anywhere (the red note says so). Pick one service and connect it:

| Service | Notes |
|---|---|
| **Netlify Forms** | Already included with Netlify's free plan — ask your helper to enable it (about 10 minutes of work). Limit: 100 submissions a month on the free plan. |
| **Formspree** | Free plan. Create a form, copy the address it gives you (looks like `https://formspree.io/f/abcd1234`). |
| **Web3Forms / Getform** | Similar to Formspree. |

Once you have an address, paste it in Admin → Settings → "Form service URL" → Publish. The red note disappears and messages arrive by email.

Remember to fill in the Privacy Policy details (who receives the messages, how long they are kept) before launch.

## 8. First-time setup (only once, done by your helper)

The admin panel needs a login system. We use **Netlify Identity** with **Git Gateway** (free plan). Your helper does this once:

1. Put the project on GitHub and connect it to Netlify ("Import from Git").
2. In Netlify: **Site configuration → Identity → Enable Identity**; then **Services → Git Gateway → Enable**.
3. Identity → **Invite users** → type your email. You will receive an invitation email; click it, choose a password, and you land in `/admin`.
4. Identity → Registration → set to **Invite only**.

> Netlify has changed its Identity plans in the past. If Identity or Git Gateway is not available on the free plan when this is set up, the alternative is the GitHub login for Decap CMS with Netlify's free GitHub OAuth. Tell your helper this note.

## 9. Who to ask for help, and what to tell them

Ask any web developer who knows **Astro** and **Netlify** (a few hours of work for anything in this guide).

Send them:
- This folder / the GitHub repository for the site (`halutzei-nof`).
- The text **"Astro static site, Decap CMS at /admin with Netlify Identity + Git Gateway, content is JSON files in `src/content`, config generated by `scripts/build-cms-config.mjs`, hosted on Netlify."**
- What you want to change, and a link to the page.

If something looks wrong after you publish, tell them the time you published and what you changed — every change is saved in the history and can be rolled back in one step.
