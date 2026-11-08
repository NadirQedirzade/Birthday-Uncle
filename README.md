# Rövşən əmi — 50

A personal 50th-birthday website for **Rövşən Qədirov** (born 28.11.1976), made by his nephew **Nadir**.
Frontend only: React, Vite, TypeScript, Tailwind CSS v4 and Motion. No backend, no API keys, no external requests (fonts are bundled).

The site is written in Azerbaijani. Every piece of text and every photo can be changed without touching the components.

---

## 1. Install dependencies

You need [Node.js](https://nodejs.org) 20.19 or newer (22 LTS recommended). Vercel uses a compatible version automatically.

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Open the address it prints (usually <http://localhost:5173>). The page reloads when you save a file or add a photo.

Useful checks:

```bash
npm run typecheck   # TypeScript, no output files
npm run build       # typecheck + production build into dist/
npm run preview     # serve the production build locally
```

## 3. Add photographs

Until you add photos, the gallery shows designed placeholders (labelled with each caption). Nothing breaks and nothing is requested from the network for a photo that does not exist.

1. Copy your images into `public/images/gallery/`
   (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` all work), for example `memory-01.jpg`.
2. Open `src/data/gallery.ts` and edit the matching entry:

   ```ts
   {
     id: 'memory-01',
     src: '/images/gallery/memory-01.jpg', // must match the file name exactly
     alt: 'Describe the photo for screen readers',
     caption: 'Birlikdə çəkilmiş xatirə',
     orientation: 'portrait',              // 'portrait' | 'landscape' | 'square'
     date: '1998',                         // optional, any text
   }
   ```

3. Save. The placeholder fades into the photo, and the tile becomes clickable and opens the lightbox.

Good to know:

- **Add, remove and reorder freely.** The gallery adapts to however many items the list has, and nothing assumes who is in a photo (old, recent, family, or the two of you all work).
- **Orientation** only controls the tile shape (portrait 4:5, landscape 3:2, square 1:1). The photo is cropped to fill the tile; the lightbox always shows the whole photo.
- **File names are case-sensitive on Vercel.** `Memory-01.JPG` and `memory-01.jpg` are different files there, even if both work on your computer. Keep names lowercase.
- **Size:** about 1600–2000 px on the long edge and under ~500 KB each keeps the page fast. Phone photos often contain GPS location in their metadata; export or "share" a copy without location if you do not want that published.
- The lightbox cycles through photos that exist. Placeholders are not clickable, because there is nothing to enlarge yet.
- Lightbox controls: click/tap a photo to open; **Esc**, the close button, a click outside, or dragging it down closes; **← →**, the arrow buttons, or a sideways swipe change photos.

## 4. Edit the birthday message

The letter from Nadir lives in its own file: **`src/data/message.ts`**.

```ts
export const letter = {
  salutation: 'Əziz Rövşən əmi,',
  paragraphs: [ '…first paragraph…', '…second paragraph…' ],
  closing: 'Hörmətlə,',
  signature: 'Nadir',
}
```

Each string in `paragraphs` becomes one paragraph. Add or remove lines as you like.

All other text (headline, section titles, milestone cards, final screen, footer) is in **`src/data/birthday.ts`**.

## 5. Build the production version

```bash
npm run build
```

The finished site is written to `dist/`. Check it with `npm run preview`.

## 6. Deploy to Vercel

The project is ready for Vercel as it is: `vercel.json` sets the framework, build command, output folder, long-term caching for hashed assets, and a few safe security headers. No environment variables are needed.

**Option A — GitHub (recommended, every push redeploys)**

1. Create a new repository on GitHub and push this folder to it
   (`node_modules` and `dist` are already in `.gitignore`).
2. Go to <https://vercel.com/new>, sign in and **Import** the repository.
3. Leave the detected settings as they are (Framework: Vite, Build: `npm run build`, Output: `dist`) and press **Deploy**.
4. When it finishes you get a `*.vercel.app` link. In **Settings → Domains** you can add your own domain.

**Option B — Vercel CLI (no GitHub needed)**

```bash
npm install -g vercel
vercel          # first run: log in and answer the prompts (accept the defaults)
vercel --prod   # publish to the production link
```

To update the live site later, change the files and deploy again (a new push on Option A, `vercel --prod` on Option B).

Tip: open the link on your phone before the 28th of November and scroll through everything once. Mobile is a dedicated layout, not just a shrunken desktop one.

---

## Project structure

```text
public/
  favicon.svg
  images/gallery/            ← put photographs here
src/
  data/
    gallery.ts               ← photo list (path, alt, caption, orientation, date)
    message.ts               ← Nadir's letter
    birthday.ts              ← all other copy
  components/
    Navbar.tsx  Hero.tsx  PhotoGallery.tsx  Lightbox.tsx  Milestone.tsx
    PersonalMessage.tsx  FinalSurprise.tsx  Footer.tsx
    Button.tsx  Reveal.tsx  SplitText.tsx  SectionHeading.tsx
    GalleryPlaceholder.tsx  Sparkles.tsx
  hooks/                     ← scroll spy, modal behaviour (scroll lock, inert background)
  lib/motion.ts              ← spring and easing tokens, momentum projection
  styles/index.css           ← colour, type and material tokens
vite.config.ts               ← also lists which gallery files exist (so no 404s for missing photos)
vercel.json
```

## Design and interaction notes

- **Look:** a true-black canvas, warm ivory text and a single champagne accent. Headings and interface text use the system font (SF Pro on Apple devices, Inter bundled everywhere else); a text serif carries the personal voice (the tagline, the letter and the love line); a handwritten face is used only for the signature. All colour, type and material tokens are at the top of `src/styles/index.css`.
- **Motion:** springs for everything the visitor touches (press, menu, lightbox, drag release), tuned near critical damping so nothing wobbles; gentle ease-out reveals for scrolling. Only `transform` and `opacity` (plus `clip-path` for image reveals) are animated. The tunings are documented in `src/lib/motion.ts`.
- **Interactions:** the mobile menu is a popover anchored to its button (closes on Esc, outside press, or choosing a link); the lightbox is a proper modal (focus is moved in and returned, the page behind is inert, scroll is locked, drag and keyboard both work).
- **Accessibility:** keyboard reachable everywhere, visible focus rings, a skip link, 44 pt minimum touch targets, text contrast above WCAG AA, and `prefers-reduced-motion` is respected (movement is replaced by gentle fades, and the celebration sparkles are dropped).
