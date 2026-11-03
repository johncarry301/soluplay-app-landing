import type { ReactNode } from "react";
import {
  ArrowLeftIcon,
  BatteryGlyph,
  CastIcon,
  ChevronRightIcon,
  HomeIcon,
  MoreIcon,
  RefreshIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  SignalGlyph,
  TvIcon,
  WifiGlyph,
} from "../../icons";

/* ------------------------------------------------------------------ *
 * CSS mockups standing in for real app screenshots.
 *
 * PLACEHOLDER: every screen below is drawn with markup, not captured from
 * an APK, and the channel names are invented so no real broadcaster is
 * represented. Replace them by filling `src` in src/config/site.config.ts.
 * ------------------------------------------------------------------ */

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone__screen">
        <div className="phone__status">
          <span className="phone__time">10:24</span>
          <span className="phone__glyphs">
            <SignalGlyph />
            <WifiGlyph />
            <BatteryGlyph />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function BottomNav({ active }: { active: "home" | "live" | "settings" }) {
  const items = [
    { id: "home", label: "Home", Icon: HomeIcon },
    { id: "live", label: "Live TV", Icon: TvIcon },
    { id: "settings", label: "Settings", Icon: SettingsIcon },
  ] as const;

  return (
    <nav className="ph-nav">
      {items.map(({ id, label, Icon }) => (
        <span key={id} className={id === active ? "ph-nav__item is-active" : "ph-nav__item"}>
          <Icon size={13} />
          <span>{label}</span>
        </span>
      ))}
    </nav>
  );
}

const CHANNELS = [
  { short: "PS", name: "Prime Sports 1", tone: "#7c4dff", sub: "Sports" },
  { short: "AS", name: "Arena Sports HD", tone: "#e11d48", sub: "Sports" },
  { short: "MS", name: "Metro Sports", tone: "#f97316", sub: "Sports" },
  { short: "ST", name: "Sky Ten Sports", tone: "#0ea5e9", sub: "Sports" },
  { short: "TS", name: "Total Sports", tone: "#dc2626", sub: "Sports" },
  { short: "WC", name: "World Cinema", tone: "#0d9488", sub: "Movies" },
  { short: "N24", name: "Metro News 24", tone: "#2563eb", sub: "News" },
  { short: "KZ", name: "Kids Zone", tone: "#d97706", sub: "Kids" },
];

function ScreenHome() {
  return (
    <PhoneFrame>
      <div className="ph-top">
        <span className="ph-top__brand">SoluPlay</span>
        <SearchIcon size={13} />
      </div>
      <div className="ph-body ph-body--gap">
        <div className="ph-hero">
          <span className="ph-hero__live">
            <i />
            LIVE
          </span>
          <span className="ph-hero__line1">LIVE SPORTS</span>
          <span className="ph-hero__line2">ARENA</span>
        </div>
        <div className="ph-fix">
          <span className="ph-fix__dot" style={{ background: "#2f8dff" }} />
          <span className="ph-fix__name">Northern FC</span>
          <span className="ph-fix__vs">VS</span>
          <span className="ph-fix__name">Coast United</span>
          <span className="ph-fix__dot" style={{ background: "#dc2626" }} />
        </div>
        <div className="ph-cta ph-cta--blue">
          <TvIcon size={13} />
          <span>Live Sports Arena</span>
        </div>
        <div className="ph-cta ph-cta--purple">
          <CastIcon size={13} />
          <span>Live TV</span>
        </div>
      </div>
      <BottomNav active="home" />
    </PhoneFrame>
  );
}

function ScreenChannels() {
  return (
    <PhoneFrame>
      <div className="ph-top">
        <ArrowLeftIcon size={13} />
        <span className="ph-top__title">Live TV</span>
        <MoreIcon size={13} />
      </div>
      <div className="ph-chips">
        <span className="ph-chip is-active">All</span>
        <span className="ph-chip">Sports</span>
        <span className="ph-chip">News</span>
        <span className="ph-chip">Movies</span>
      </div>
      <div className="ph-body ph-body--list">
        {CHANNELS.map((c) => (
          <div key={c.name} className="ph-row">
            <span className="ph-logo" style={{ background: c.tone }}>
              {c.short}
            </span>
            <span className="ph-row__copy">
              <span className="ph-row__name">{c.name}</span>
              <span className="ph-row__sub">{c.sub}</span>
            </span>
            <ChevronRightIcon size={13} className="ph-row__arrow" />
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function ScreenPlayer() {
  return (
    <PhoneFrame>
      <div className="ph-video">
        <div className="ph-video__bar">
          <ArrowLeftIcon size={13} />
          <ShareIcon size={13} />
        </div>
        <div className="ph-pitch">
          <span className="ph-pitch__circle" />
          <span className="ph-pitch__strip ph-pitch__strip--a" />
          <span className="ph-pitch__strip ph-pitch__strip--b" />
          <span className="ph-pitch__man ph-pitch__man--1" />
          <span className="ph-pitch__man ph-pitch__man--2" />
          <span className="ph-pitch__man ph-pitch__man--3" />
        </div>
        <div className="ph-video__controls">
          <span className="ph-live">
            <i />
            LIVE
          </span>
          <span className="ph-ico">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1.2" />
              <rect x="14" y="4" width="4" height="16" rx="1.2" />
            </svg>
          </span>
          <span className="ph-ico">
            <RefreshIcon size={12} />
          </span>
        </div>
      </div>
      <div className="ph-body ph-body--gap">
        <div className="ph-row ph-row--tight">
          <span className="ph-logo ph-logo--blue">PS</span>
          <span className="ph-row__copy">
            <span className="ph-row__name">Prime Sports 1</span>
            <span className="ph-row__sub">Live now</span>
          </span>
          <ChevronRightIcon size={13} className="ph-row__arrow" />
        </div>
        <p className="ph-label">Quality</p>
        <div className="ph-chips ph-chips--tight">
          <span className="ph-chip is-active">Auto</span>
          <span className="ph-chip">720p</span>
          <span className="ph-chip">1080p</span>
        </div>
        <p className="ph-label">Up next</p>
        {CHANNELS.slice(1, 4).map((c) => (
          <div key={c.name} className="ph-row ph-row--tight">
            <span className="ph-logo" style={{ background: c.tone }}>
              {c.short}
            </span>
            <span className="ph-row__copy">
              <span className="ph-row__name">{c.name}</span>
              <span className="ph-row__sub">{c.sub}</span>
            </span>
            <ChevronRightIcon size={13} className="ph-row__arrow" />
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

const GLYPHS: Record<string, ReactNode> = {
  sports: <circle cx="12" cy="12" r="7" />,
  news: <path d="M5 7h14M5 12h14M5 17h9" />,
  movies: <path d="M9 6.5v11l9-5.5Z" />,
  shows: <path d="M5.5 5.5h5v5h-5Zm8 0h5v5h-5Zm-8 8h5v5h-5Zm8 0h5v5h-5Z" />,
  kids: <path d="m12 4.5 2.3 4.7 5.2.8-3.7 3.7.9 5.1-4.7-2.4-4.7 2.4.9-5.1L4.5 10l5.2-.8Z" />,
  music: <path d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
  docs: <path d="M4 5h16v14H4Zm4 0v14m8-14v14M4 9.7h4m-4 4.6h4m8-4.6h4m-4 4.6h4" />,
  globe: <path d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm-7.5 7.5h15M12 4.5c2.4 2.4 2.4 12.6 0 15M12 4.5c-2.4 2.4-2.4 12.6 0 15" />,
};

const CATEGORIES: Array<{ label: string; glyph: keyof typeof GLYPHS; tone: string }> = [
  { label: "Sports", glyph: "sports", tone: "#16a34a" },
  { label: "News", glyph: "news", tone: "#2563eb" },
  { label: "Movies", glyph: "movies", tone: "#9333ea" },
  { label: "Entertainment", glyph: "shows", tone: "#dc2626" },
  { label: "Kids", glyph: "kids", tone: "#f97316" },
  { label: "Music", glyph: "music", tone: "#d946ef" },
  { label: "Documentary", glyph: "docs", tone: "#0891b2" },
  { label: "International", glyph: "globe", tone: "#7c3aed" },
];

function ScreenCategories() {
  return (
    <PhoneFrame>
      <div className="ph-top">
        <ArrowLeftIcon size={13} />
        <span className="ph-top__title">Categories</span>
        <span className="ph-top__spacer" />
      </div>
      <div className="ph-body ph-body--list ph-body--scroll">
        {CATEGORIES.map((c) => (
          <div key={c.label} className="ph-row ph-row--cat">
            <span className="ph-cat" style={{ background: c.tone }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {GLYPHS[c.glyph]}
              </svg>
            </span>
            <span className="ph-row__name">{c.label}</span>
          </div>
        ))}
      </div>
      <BottomNav active="home" />
    </PhoneFrame>
  );
}

export const MOCK_SCREENS = {
  home: ScreenHome,
  channels: ScreenChannels,
  player: ScreenPlayer,
  categories: ScreenCategories,
};

export type MockKey = keyof typeof MOCK_SCREENS;
