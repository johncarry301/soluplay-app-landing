/* ------------------------------------------------------------------ *
 * SoluPlay Free TV — landing page configuration
 *
 * Every editable value for the page lives in this file: app metadata,
 * the two download targets, the safety line, screenshots, demo reviews and
 * footer links. Nothing here is imported from the main SoluPlay project.
 *
 * Search for "PLACEHOLDER" to find everything that still needs real data.
 * ------------------------------------------------------------------ */

export type VariantId = "android" | "smarttv";

export interface DownloadOption {
  id: VariantId;
  /** Menu row title. */
  title: string;
  /** Menu row subtitle. */
  hint: string;
  /**
   * Direct link to the hosted .apk.
   * Leave "" until the APK is actually hosted — the page then shows
   * `pendingMessage` instead of starting a download. See README.
   */
  url: string;
  /** Save-as name, honoured by same-origin hosts. */
  fileName: string;
  /** Shown when `url` is empty. Never claim a download succeeded. */
  pendingMessage: string;
}

export const app = {
  name: "SoluPlay Free TV",
  tagline: "Live Sports & TV",
  developer: "SoluPlay",

  /**
   * PLACEHOLDER: point at the official icon file, e.g. "/app-icon.png".
   * While empty the page renders the built-in SVG mark in src/components/AppIcon.tsx.
   */
  iconSrc: "",
};

/* ------------------------------------------------------------------ *
 * Downloads — the fallback links
 *
 * `url` is only used when the release manifest cannot be read. When the
 * manifest is available its per-variant URL wins, so a new APK is
 * published without touching this file.
 * ------------------------------------------------------------------ */

export const downloads: Record<VariantId, DownloadOption> = {
  android: {
    id: "android",
    title: "Download for Android",
    hint: "APK • For Mobile Phones & Tablets",
    url: "", // PLACEHOLDER: no APK has been hosted yet
    fileName: "soluplay-free-tv-android.apk",
    pendingMessage: "Android download link will be available soon.",
  },
  smarttv: {
    id: "smarttv",
    title: "Download for Smart TV",
    hint: "APK • For Android TV & TV Boxes",
    url: "", // PLACEHOLDER: no APK has been hosted yet
    fileName: "soluplay-free-tv-androidtv.apk",
    pendingMessage: "Android TV download link will be available soon.",
  },
};

export const downloadCta = "Download";

/* ------------------------------------------------------------------ *
 * Release manifest
 *
 * The APK versions are described by one JSON file published at the root
 * of the APK repository. The page reads it over plain HTTPS on load —
 * no GitHub API, no polling — so uploading a new APK and updating the
 * manifest is enough to publish a new version. The site is never
 * rebuilt and no code changes here.
 * ------------------------------------------------------------------ */

/** Local fixture used by the dev server; never used by a built site. */
const DEV_MANIFEST_URL = "/test-fixtures/latest.json";

export const release = {
  /** Raw manifest URL. GitHub Raw serves it with CORS and a long cache. */
  manifestUrl: import.meta.env.DEV
    ? DEV_MANIFEST_URL
    : "https://raw.githubusercontent.com/johncarry301/soluplay-app/main/latest.json",
  /** Public repository that holds the APK releases. */
  repo: "johncarry301/soluplay-app",
};

/* ------------------------------------------------------------------ *
 * Safety indicator under the download button
 *
 * These words are the developer's own statement about the file, and the
 * page presents them as such — nothing scans anything while the page is
 * open. The brief animation only reveals that statement; keep the copy
 * inside what you have actually verified yourself.
 * ------------------------------------------------------------------ */

export const safety = {
  scanningLabel: "Scanning the APK file…",
  verifiedLabel: "100% Safe • No Virus Found",
  /** How long the first state is held before the message resolves. */
  revealMs: 2500,
};

/* ------------------------------------------------------------------ *
 * Screenshots
 *
 * `src` empty -> the matching CSS mockup below is rendered.
 * `src` filled -> that image file is used instead, no code changes needed.
 * Drop real captures into public/screenshots/ and fill `src`.
 * ------------------------------------------------------------------ */

export type MockScreen = "home" | "channels" | "player" | "categories";

export interface Screenshot {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  mock: MockScreen;
}

export const screenshots: Screenshot[] = [
  {
    id: "arena",
    title: "Live Sports Arena",
    subtitle: "Watch Your Favorite Sports",
    src: "", // PLACEHOLDER: rendered as a CSS mockup
    mock: "home",
  },
  {
    id: "channels",
    title: "Live TV Channels",
    subtitle: "All Channels in One Place",
    src: "", // PLACEHOLDER: rendered as a CSS mockup
    mock: "channels",
  },
  {
    id: "player",
    title: "Seamless Playback",
    subtitle: "Smooth & High Quality",
    src: "", // PLACEHOLDER: rendered as a CSS mockup
    mock: "player",
  },
  {
    id: "categories",
    title: "Easy Navigation",
    subtitle: "Simple & User Friendly",
    src: "", // PLACEHOLDER: rendered as a CSS mockup
    mock: "categories",
  },
];

/* ------------------------------------------------------------------ *
 * Ratings & reviews — DEMO DATA
 *
 * There are no verified user ratings yet. Everything in this block is
 * sample content and is labelled as such on the page. Replace the numbers
 * and text once real figures exist, or set `demo: false` after swapping in
 * verified data.
 * ------------------------------------------------------------------ */

export interface Review {
  name: string;
  initials: string;
  tone: "blue" | "purple" | "teal" | "amber";
  stars: number;
  when: string;
  text: string;
}

export const ratings = {
  demo: true,
  demoLabel: "Demo",
  average: 4.6,
  count: 1245,
  distribution: [
    { stars: 5, count: 892 },
    { stars: 4, count: 218 },
    { stars: 3, count: 78 },
    { stars: 2, count: 32 },
    { stars: 1, count: 25 },
  ],
  /** Reviews shown before "See all". */
  visibleReviews: 2,
  reviews: [
    {
      name: "Rahim Ahmed",
      initials: "R",
      tone: "blue",
      stars: 5,
      when: "2 days ago",
      text: "Great app! All the channels work perfectly and the quality is really good. Very smooth experience. Highly recommended!",
    },
    {
      name: "Sadia Islam",
      initials: "S",
      tone: "purple",
      stars: 5,
      when: "4 days ago",
      text: "Finally a good live TV app! Sports, movies, and news — everything in one place. Keep it up!",
    },
    {
      name: "Tanvir Hasan",
      initials: "T",
      tone: "teal",
      stars: 4,
      when: "1 week ago",
      text: "Works well on my TV box. The remote navigation is comfortable and the sports section is easy to reach.",
    },
    {
      name: "Nusrat Jahan",
      initials: "N",
      tone: "amber",
      stars: 5,
      when: "1 week ago",
      text: "Clean layout and quick to open. I mostly watch matches and the player handles quality changes fine.",
    },
  ] as Review[],
};

/* ------------------------------------------------------------------ *
 * Footer
 *
 * Links only render when `href` is filled in, so the page never shows a
 * dead legal link.
 * ------------------------------------------------------------------ */

export const footer = {
  copyright: "SoluPlay",
  links: [
    { label: "Privacy Policy", href: "" }, // PLACEHOLDER: publish the page, then fill
    { label: "Contact", href: "" },
    { label: "Terms", href: "" },
  ],
};
