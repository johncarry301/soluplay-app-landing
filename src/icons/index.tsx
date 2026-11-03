import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 19h16" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M10.5 18.5h3" />
  </svg>
);

export const TvIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
    <path d="M8 20.5h8" />
    <path d="M12 16.5v4" />
  </svg>
);

export const DevicesIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5" width="13" height="9.5" rx="1.8" />
    <path d="M6.5 18h5" />
    <rect x="16.5" y="10.5" width="5" height="9" rx="1.6" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 5 5.8v5.4c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V5.8Z" />
    <path d="m9.2 11.8 2 2 3.6-3.8" />
  </svg>
);

export const InfoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 7.8h.01" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

export const MoreIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 0 })} fill="currentColor">
    <circle cx="12" cy="5" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="12" cy="19" r="1.7" />
  </svg>
);

export const ShareIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 15V3.5" />
    <path d="m8 7 4-3.5L16 7" />
    <path d="M5 12v7.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V12" />
  </svg>
);

export const RefreshIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 11a8 8 0 0 0-13.7-5.2L4 8" />
    <path d="M4 4v4h4" />
    <path d="M4 13a8 8 0 0 0 13.7 5.2L20 16" />
    <path d="M20 20v-4h-4" />
  </svg>
);

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m3.5 10.5 8.5-7 8.5 7" />
    <path d="M5.5 9v11h13V9" />
  </svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.6M12 18.6v2.6M4.5 7.3l2.2 1.3M17.3 15.4l2.2 1.3M4.5 16.7l2.2-1.3M17.3 8.6l2.2-1.3" />
  </svg>
);

export const CastIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 8V6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5H13" />
    <path d="M3 12.5A6.5 6.5 0 0 1 9.5 19" />
    <path d="M3 16a3 3 0 0 1 3 3" />
    <path d="M3.2 19.2h.01" />
  </svg>
);

export const StarIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    focusable="false"
    {...rest}
  >
    <path d="m12 2.6 2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95Z" />
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 0 })} fill="currentColor">
    <path d="M8 5.5v13l11-6.5Z" />
  </svg>
);

/* Tiny status-bar glyphs used inside the phone mockups. */
export const SignalGlyph = ({ size = 11 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
    <path d="M1 11V8h2v3Zm3.2 0V5.5h2V11Zm3.2 0V3h2v8Zm3.2 0V.8h2V11Z" />
  </svg>
);

export const WifiGlyph = ({ size = 11 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
    <path d="M6 8.6 4.2 6.8a2.6 2.6 0 0 1 3.6 0Zm0-3.3c-1.3 0-2.5.5-3.4 1.3L1.3 5.3a7 7 0 0 1 9.4 0L8.1 6.6A4.9 4.9 0 0 0 6 5.3Zm0-3c-2 0-3.9.7-5.3 2L.1 3.7a9.2 9.2 0 0 1 11.8 0L10 4.3A7.7 7.7 0 0 0 6 2.3Z" />
  </svg>
);

export const BatteryGlyph = ({ size = 12 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 14 12" fill="none" aria-hidden>
    <rect x=".8" y="2.5" width="10.4" height="7" rx="1.6" stroke="currentColor" strokeWidth="1" />
    <rect x="2.2" y="3.9" width="7.6" height="4.2" rx=".8" fill="currentColor" />
    <path d="M12.6 5v2a1.4 1.4 0 0 0 0-2Z" fill="currentColor" />
  </svg>
);
