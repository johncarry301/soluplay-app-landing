import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  app,
  downloadCta,
  downloads,
  type VariantId,
} from "../config/site.config";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  InfoIcon,
  PhoneIcon,
  TvIcon,
} from "../icons";
import { useRelease } from "../lib/ReleaseContext";
import {
  formatBytes,
  resolveVariant,
  type ManifestVariantId,
} from "../lib/release";

const ORDER: VariantId[] = ["android", "smarttv"];
const NOTICE_MS = 7000;

/** Which manifest variant backs each menu row. */
const MANIFEST_VARIANT: Record<VariantId, ManifestVariantId> = {
  android: "phone",
  smarttv: "tv",
};

function startDownload(url: string, fileName: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function DownloadMenu() {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const { status, manifest } = useRelease();
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const focusItem = (index: number) => {
    const wrapped = (index + ORDER.length) % ORDER.length;
    itemRefs.current[wrapped]?.focus();
  };

  const choose = useCallback(
    (id: VariantId) => {
      const option = downloads[id];
      const published = resolveVariant(manifest, MANIFEST_VARIANT[id]);
      const url = (published?.url || option.url).trim();
      close(true);

      // Never report a download that was not actually handed to the browser.
      if (url) {
        startDownload(url, published?.fileName || option.fileName);
        setNotice(`${option.title}: download started.`);
      } else {
        setNotice(option.pendingMessage);
      }
    },
    [close, manifest],
  );

  const metaFor = (id: VariantId) => {
    if (status !== "ready" || !manifest) return "";

    const published = resolveVariant(manifest, MANIFEST_VARIANT[id]);
    const size = formatBytes(published?.sizeBytes ?? manifest.sizeBytes);
    const version = manifest.versionName ? `v${manifest.versionName}` : "";

    return [version, size].filter(Boolean).join("  •  ");
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onScrollOrResize = () => setOpen(false);

    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useLayoutEffect(() => {
    if (open) itemRefs.current[0]?.focus();
  }, [open]);

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "ArrowDown":
        event.preventDefault();
        focusItem(document.activeElement === itemRefs.current[1] ? 0 : 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(document.activeElement === itemRefs.current[0] ? 1 : 0);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(ORDER.length - 1);
        break;
      case "Tab":
        // Leaving the menu closes it without trapping keyboard users.
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="dl" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className="dl__trigger"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="download-menu"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
      >
        <DownloadIcon size={23} />
        <span>{downloadCta}</span>
        <ChevronDownIcon size={21} className={open ? "dl__chev is-open" : "dl__chev"} />
      </button>

      {open && (
        <div
          id="download-menu"
          className="dl__menu"
          role="menu"
          aria-label={`${app.name} download options`}
          onKeyDown={onMenuKeyDown}
        >
          {ORDER.map((id, index) => {
            const option = downloads[id];
            const Icon = id === "android" ? PhoneIcon : TvIcon;
            const meta = metaFor(id);
            return (
              <div key={id} className={index === 0 ? "dl__item-wrap" : "dl__item-wrap dl__item-wrap--split"}>
                <button
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  type="button"
                  role="menuitem"
                  className="dl__item"
                  onClick={() => choose(id)}
                >
                  <span className={`dl__item-icon dl__item-icon--${id}`}>
                    <Icon size={23} />
                  </span>
                  <span className="dl__item-copy">
                    <span className="dl__item-title">{option.title}</span>
                    <span className="dl__item-hint">{option.hint}</span>
                    {meta && <span className="dl__item-meta">{meta}</span>}
                  </span>
                  <ChevronRightIcon size={20} className="dl__item-arrow" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Live region stays mounted and unstyled so later changes are announced. */}
      <div className="dl__live" role="status" aria-live="polite">
        {notice && (
          <p className="dl__notice">
            <InfoIcon size={17} />
            <span>{notice}</span>
          </p>
        )}
      </div>
    </div>
  );
}
