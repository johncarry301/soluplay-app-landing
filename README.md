# SoluPlay Free TV — App Download Landing Page

Standalone, static landing page for distributing the SoluPlay Free TV Android build
(phone/tablet APK and Android TV APK). It is deliberately **not** part of the main
SoluPlay project: no shared source, no shared config, no backend, no analytics, and
no reference to the main account or its repositories.

## Stack

- React 18 + TypeScript
- Vite 5 (`base: "./"`, so `dist/` works from a domain root or any sub-path)
- Hand-written SVG icons and plain CSS — no UI framework, no icon package
- One network request per visit: the release manifest, read from GitHub Raw

## Commands

```bash
npm install        # dependencies, installed only inside this folder
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build into dist/
npm run preview    # serve the built dist/ locally
npm test           # headless-Chrome download-flow test (needs Chrome installed)
```

`npm test` runs two modes. Without arguments it boots the dev server against the local
fixture in `test-fixtures/` and proves that a click on each download row hands the APK
to the browser and leaves the visitor on the page. With `--preview` it serves the built
`dist/` and proves that a missing manifest degrades to the "link will be available
soon" notice instead of a broken button.

## The release manifest is the source of truth

The page does not hard-code an APK URL. On every visit it reads one JSON file:

```
https://raw.githubusercontent.com/johncarry301/soluplay-app/main/latest.json
```

That manifest carries the version, the download URL, the file size, the SHA-256, the
release notes and the phone/TV variants. The page shows the version and the size under
the download button and points each menu row at the manifest's asset URL.

No GitHub API is called and nothing polls — the file is fetched once and revalidated,
so uploading a new APK and committing the new manifest publishes a new version without
touching this codebase or redeploying the site.

If the manifest cannot be read, the page falls back to the `downloads` block in
`src/config/site.config.ts`; if that is empty too, the row shows its
`pendingMessage` and never claims a download started.

### Where to configure the fallback download links

One file: **`src/config/site.config.ts`** → the `downloads` object. These are only used
when the manifest is unavailable.

```ts
export const downloads: Record<VariantId, DownloadOption> = {
  android: {
    id: "android",
    title: "Download for Android",
    hint: "APK • For Mobile Phones & Tablets",
    url: "",                       // <-- fallback link, empty until an APK is hosted
    fileName: "soluplay-free-tv-android.apk",
    pendingMessage: "Android download link will be available soon.",
  },
  smarttv: {
    id: "smarttv",
    title: "Download for Smart TV",
    hint: "APK • For Android TV & TV Boxes",
    url: "",                       // <-- fallback link, empty until an APK is hosted
    fileName: "soluplay-free-tv-androidtv.apk",
    pendingMessage: "Android TV download link will be available soon.",
  },
};
```

Everything else on the page reads from that same file: `app` (name, tagline, developer,
icon), `safety` (the one-line indicator under the button), `screenshots`, `ratings` (demo
reviews), `footer`, and `release` (the manifest URL).

### Hosting the APKs

The APKs are published as **GitHub Releases assets** in `johncarry301/soluplay-app`.
The release must be public, and the manifest must point at the asset URL directly —
never at a release webpage.

```
https://github.com/johncarry301/soluplay-app/releases/latest/download/SoluPlay.apk
```

GitHub serves that with `Content-Disposition: attachment`, so the browser saves the
file instead of navigating away, and the visitor stays on the landing page.

Notes:

- Keep the APK on HTTPS — this page will normally be served over HTTPS and browsers
  block mixed-content downloads.
- Some browsers warn before downloading APK files. That is expected Android-side
  behaviour, not a page bug.
- Do not put credentials, bucket keys or private URLs in this project. Everything here
  ships to visitors.

## Replacing the placeholder assets

| Placeholder | Location | How to replace |
| --- | --- | --- |
| App icon | `src/components/AppIcon.tsx` (built-in SVG mark) | Drop the real icon in `public/` and set `app.iconSrc` in the config, e.g. `"/app-icon.png"`. No component change needed. |
| 4 screenshot cards | `src/components/screens/MockScreens.tsx` (CSS mockups) | Put captures in `public/screenshots/` and fill each entry's `src` in `screenshots`. The `<img>` path takes over automatically. |
| Channel names inside the mockups | `CHANNELS` in `MockScreens.tsx` | Invented names (`Prime Sports 1`, `Arena Sports HD`, …) so no real broadcaster is represented. They disappear once real screenshots are used. |
| Ratings, review counts, review text | `ratings` in `site.config.ts` | **Demo data.** There are no verified user ratings yet, so the page labels the section "Demo" and prints a disclaimer. Replace the numbers or delete the block. |
| Footer Privacy / Contact / Terms | `footer.links` in `site.config.ts` | Empty `href` means the link is not rendered at all, so no dead links appear. |

## Structure

```
src/
  config/site.config.ts      all editable content + the manifest URL
  lib/release.ts             manifest types, parsing, variant resolution
  lib/ReleaseContext.tsx     fetches the manifest once, keeps its state
  icons/index.tsx            inline SVG icon set
  components/
    AppIdentity.tsx          icon, name, tagline, developer
    DownloadMenu.tsx         the two-option download menu
    ReleaseInfo.tsx          version, size, release date, Android requirement
    SafetyIndicator.tsx      one-line scan → verified message
    ScreenshotGallery.tsx    4-up gallery, snap rail from 700px
    RatingsReviews.tsx       score, distribution, review cards
    SiteFooter.tsx           one-line mark + copyright
    AppIcon.tsx              placeholder mark
    screens/MockScreens.tsx  CSS phone mockups
  styles/app.css             all styling
scripts/
  test-download-flow.mjs     headless-Chrome download-flow test
test-fixtures/
  latest.json                local manifest used by the dev server only
```

## Release info line

`ReleaseInfo.tsx` is one line under the download menu. While the manifest is loading
it says so; once it arrives it shows the version, the file size, the release date and
the minimum Android version. If the manifest cannot be read the line disappears and
the download rows fall back to their own configuration — the page never shows a
version it is not sure about.

## Download menu behaviour

Click or `Enter`/`Space`/`ArrowDown` opens the menu anchored under the button. `ArrowUp`/
`ArrowDown`/`Home`/`End` move between the two options, `Enter` selects, `Escape` closes and
returns focus to the button, `Tab` closes, and a click outside closes. Each option is a real
`<button role="menuitem">` with a 72px touch target, and the menu sits above the sections
below it.

## Safety indicator behaviour

`SafetyIndicator.tsx` is one horizontal line under the download button. It shows
`safety.scanningLabel` for `safety.revealMs`, then cross-fades to `safety.verifiedLabel`.

Both states live in the same grid cell, so the block is always sized for the longer line and
nothing below it moves when the state changes. The two rows are `aria-hidden`; an `sr-only`
child of the `role="status"` container carries the text, so screen readers get one polite
announcement instead of two halves.

Under `prefers-reduced-motion: reduce` there is no reveal to wait for — the component mounts
already resolved and the scanning beam never runs.

The wording is the developer's own claim about the file, not a live scan: nothing on the page
inspects anything while it is open. Keep `verifiedLabel` inside what you have actually
verified yourself, and change both strings in `site.config.ts` if you want softer phrasing.

## Responsive targets

The safety line stays on exactly one line in both states at every width from 320px up. Audited
at 320, 340, 360, 390, 430, 600, 768, 1024, 1280 and 1440px: the document's scroll width never
exceeds the viewport at any of them, the indicator measures one text line, nothing is clipped,
and the section below it does not move across the state change.

All four screenshots sit on one line with no sideways scrolling below 700px — the track is a
4-column grid there, and each phone mock is authored at 168px then scaled to the card with a
container query, so the screens shrink instead of clipping. From 700px the track becomes the
fixed-width snap rail again, with subtitles and the arrow controls returning at 900px.
Reviews go two-column at 1080px.

## Isolation

This folder is self-contained. It depends on nothing but its own `package.json`, it
imports nothing from the main SoluPlay project, and it references neither the main
account nor its repositories. Its own Git repository is `johncarry301/soluplay-app-landing`
and its only outbound request is the release manifest in `johncarry301/soluplay-app`.
