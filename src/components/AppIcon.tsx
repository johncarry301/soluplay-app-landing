import { app } from "../config/site.config";

/**
 * SoluPlay app mark.
 *
 * PLACEHOLDER: this is a neutral stand-in drawn to match the approved
 * reference (rounded navy tile, cyan→blue play triangle, wordmark).
 * Set `app.iconSrc` in src/config/site.config.ts to use the real icon file.
 */
export default function AppIcon({ rounded = 22 }: { rounded?: number }) {
  if (app.iconSrc) {
    return (
      <img
        className="mark-img"
        src={app.iconSrc}
        alt={`${app.name} app icon`}
        width={128}
        height={128}
      />
    );
  }

  return (
    <svg className="mark" viewBox="0 0 128 128" role="img" aria-label={`${app.name} app icon`}>
      <defs>
        <linearGradient id="mark-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16294a" />
          <stop offset="55%" stopColor="#0b1730" />
          <stop offset="100%" stopColor="#060c1a" />
        </linearGradient>
        <linearGradient id="mark-play" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5ee7ff" />
          <stop offset="60%" stopColor="#37a4ff" />
          <stop offset="100%" stopColor="#2f6bff" />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="126" height="126" rx={rounded} fill="url(#mark-tile)" />
      <rect
        x="1.5"
        y="1.5"
        width="125"
        height="125"
        rx={rounded - 1}
        fill="none"
        stroke="rgba(255,255,255,.10)"
        strokeWidth="1.5"
      />

      {/* Outer play triangle, drawn as a thick gradient outline. */}
      <path
        d="M50 26.5 96.5 55.8a6 6 0 0 1 0 10.3L50 95.4a6 6 0 0 1-9.1-5.1V31.6a6 6 0 0 1 9.1-5.1Z"
        fill="none"
        stroke="url(#mark-play)"
        strokeWidth="7.5"
        strokeLinejoin="round"
      />
      {/* Solid inner triangle. */}
      <path
        d="M56.5 43.5 84 58.6a3 3 0 0 1 0 5.2L56.5 79.3a3 3 0 0 1-4.5-2.6V46.1a3 3 0 0 1 4.5-2.6Z"
        fill="#eaf4ff"
      />

      <text
        x="64"
        y="115"
        textAnchor="middle"
        fill="#f4f8ff"
        fontSize="19"
        fontWeight="700"
        letterSpacing=".2"
        fontFamily="inherit"
      >
        SoluPlay
      </text>
    </svg>
  );
}
