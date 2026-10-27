# Halutzei Nof website — guide for Dave

You do not need to code. Everything you will want to change is in the **admin panel**.

**Hosting is local for now.** The site is not published anywhere yet. It runs only on your computer, and nothing is sent to GitHub or any hosting company. When you decide where to host it, see section 8.

---

## 1. Open the site and the admin panel on your computer

1. Open Terminal in the project folder and run:

   ```
   npm install      (only the first time)
   npm run dev
   ```
2. The site is at **http://localhost:4321/** (Hebrew) and **http://localhost:4321/en/** (English).
3. The admin panel is at **http://localhost:4321/admin/index.html**. Open it in **Chrome**, click **Work with Local Repository**, and choose this project folder.
4. Edit, press **Save**, and the change appears on the local site straight away. Nothing is published.

To stop, press `Ctrl + C` in Terminal.

## 2. How the admin panel is organised

On the left:

- **עמודים / Pages**: Home, About, Vision, Community & Education, Join & FAQ, Contact, Accessibility, Privacy, Donate (off).
- **הגדרות / Settings**: contact details, background photos, on/off switches, and the fixed texts (menu, buttons, form messages, footer).

Every page has two boxes: **עברית (Hebrew)** and **English**. Every sentence on the page is in one of them. A **blank line** inside a long text starts a new paragraph.

The name is always written **Halutzei Nof** in English. Do not translate it.

## 3. The pages

The menu has five items plus the gold Join button.

| Page | Address (Hebrew / English) | What you edit |
|---|---|---|
| Home | `/` and `/en/` | Main line, slogan, overview sentence, three teaser cards, "Who the community is for", the value icons, photos below the intro, closing text |
| About | `/about/` | One-line summary, community identity, who it is for, character, and **In Their Memory** at the bottom |
| Vision | `/vision/` | Two groups of cards: the vision (5 cards) and the nine values |
| Community & Education | `/community/` | Two groups of cards: community and family life, and education and Jewish identity |
| Join | `/join/` | Intro, the four steps, the **FAQ**, and the join form |
| Contact | `/contact/` | Intro; the contact details come from Settings |

**Vision and Community** work the same way: each page is a list of **groups**, and each group is a box of short cards (an icon, a title of two to four words, and one line). Add, remove or reorder them with the list buttons. The "link id" of a group (for example `values`) is what makes the link `/vision/#values` work, so please do not change it.

### FAQ
It is on the Join page. Admin → Pages → **Join & FAQ** → "Questions and answers". Click **Add** for a new question. Each one needs a question and an answer. Please do not add a question about location. The footer link "Frequently asked questions" jumps straight to it.

### The blue bookmarks
Blue notes on the pages are ideas about what a visitor will want to know. They are listed with suggestions in `TODO.md`. Delete the `[[BM1]]` style code from the text when you have decided. They disappear with the red notes when you turn off "Show red TODO markers".

### The Join form
- The four steps are in Admin → Pages → **Join & FAQ**.
- The form labels and error messages are in Admin → Settings → **Menus, form, footer text** → Form.
- The form sends to the same address as the Contact form (Settings → "Form service URL"). Each message carries a hidden label, `form_type = join` or `form_type = contact`, so you can tell them apart in your inbox. The email subject also says which form it came from.

### Events are gone
The Events feature was removed completely (the collection, the list on the Community page, and the "no events" message).

### No family number anywhere
The site shows no number of families or members. The text says "a growing core of families". The old "Family count verified" switch still exists in Settings but does nothing visible.

## 4. Change a photo

**Background photos.** Every page has its own full-screen photo that stays still while the text scrolls over it.
1. Admin → **Settings** → **General settings, contact and background photos**.
2. Find "Background photo: …" for the page you want.
3. Choose a different image and save.

A horizontal photo works best for most pages; a vertical one suits Vision. Use a sharp image at least 1600 pixels wide. The site shrinks and converts photos by itself.

**Photos below the intro on Home:** Admin → Pages → Home → "Photos below the intro". Add a photo and a short description of what is in it (for people who use screen readers).

**Memorial photos:** Admin → Pages → About → "The fallen".

## 5. In Their Memory

It is at the bottom of the About page, looking exactly as before: six cards. Fill in each person's story in Admin → Pages → About → "The fallen". When the families have approved, tick **Memorial approved** in Settings and the red note disappears.

## 6. Red TODO markers

The red notes are reminders for you. Each one disappears by itself when the thing it asks for is done:

| Red note | What makes it disappear |
|---|---|
| Photo not licensed (Home) | Replace the Home photo, tick "Home photo is licensed" |
| Awaiting families' approval | Tick "Memorial approved" |
| Phone / email / Instagram / Facebook | Type the real value in Settings |
| Form destination | Paste the form service address in Settings |
| Legal entity name | Type the name in Settings |
| **Placeholder copy — final wording needed** | Edit the text and delete `[[DRAFT]]` from it |

**To hide ALL red notes at once**: Admin → Settings → turn **off** "Show red TODO markers" → Save. If a phone number or email is still empty when you do this, that line simply disappears instead of showing "[Phone number]". The full list of open items is in `TODO.md`.

## 7. Turn on the Donate page later

The Donate page exists but is **off**. It is not in the menu, not in the sitemap, and not shown to Google. Turn it on only after the legal framework and the donation method are in place.

1. Write the text: Admin → Pages → **Donate**.
2. Admin → Settings → turn **on** "Turn on the Donate page" → Save.
3. The page appears at `/donate/` and `/en/donate/`. It still will not appear in the menu.

## 8. Hosting later

Nothing is published yet. The project still has a deploy file for GitHub Pages (`deploy/github-pages-deploy.yml`), left exactly as it was. It does nothing until you decide to use it.

When you choose a host:
- Run `npm run build`. The finished site is the `dist/` folder. It contains only the public site, not `TODO.md`, this guide or any other internal file.
- Fill in **Settings → Site address** (for example `https://your-domain`). This makes the sitemap, the English/Hebrew links and the share image use full addresses.
- Remember that publishing makes everything on the site public, including the Home photo, which is not licensed yet.

## 9. The forms

Both forms send each message to the address in Settings → "Form service URL" through a free service called **FormSubmit**.

- **First time only:** when the site is online, send one test message from each form, then check the inbox. FormSubmit emails an **activation link**. Click it. After that every message arrives as a normal email (check Spam the first time).
- Forms really send, even while you run the site on your own computer: a test message from `localhost` is delivered to your inbox.
- The destination email is visible in the site's code. Expect some spam, and consider a dedicated address later.
- Complete the Privacy Policy details (how long messages are kept, who to contact) before launch.

## 10. Who to ask for help

Any web developer who knows **Astro**. Send them:
- The project folder.
- This text: **"Astro static site, Hebrew (RTL) default with English under /en/. Content is JSON in `src/content`. Admin at /admin is Sveltia CMS; its config is generated by `scripts/build-cms-config.mjs`, so edit that script, never `public/admin/config.yml`. Photos go in `public/photos` and are optimized by `scripts/optimize-images.mjs`."**
- What you want to change, and which page it is on.

Every change is a git commit in the project folder, so anything can be undone.
