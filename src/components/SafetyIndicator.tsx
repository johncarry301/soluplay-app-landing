import { useEffect, useState } from "react";
import { safety } from "../config/site.config";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;
}

export default function SafetyIndicator() {
  // Under reduced motion there is no reveal to wait for, so the message
  // appears already resolved.
  const [pending, setPending] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (!pending) return;
    const id = window.setTimeout(() => setPending(false), safety.revealMs);
    return () => window.clearTimeout(id);
  }, [pending]);

  return (
    <div className="safety" role="status" aria-live="polite">
      <span className="sr-only">{pending ? safety.scanningLabel : safety.verifiedLabel}</span>

      <span className={`safety__row${pending ? " is-active" : ""}`} aria-hidden="true">
        <span className="safety__icon safety__icon--scan">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none">
            <defs>
              <clipPath id="safety-file">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              </clipPath>
              <linearGradient id="safety-beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                <stop offset=".5" stopColor="currentColor" stopOpacity=".9" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <g clipPath="url(#safety-file)">
              <rect className="safety__beam" x="4" y="-8" width="16" height="8" fill="url(#safety-beam)" />
            </g>
          </svg>
        </span>
        <span className="safety__text">{safety.scanningLabel}</span>
      </span>

      <span className={`safety__row safety__row--ok${pending ? "" : " is-active"}`} aria-hidden="true">
        <span className="safety__icon">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none">
            <circle
              className="safety__ring"
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              className="safety__tick"
              d="m7.8 12.3 2.9 2.9 5.5-6.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="safety__text">{safety.verifiedLabel}</span>
      </span>
    </div>
  );
}
