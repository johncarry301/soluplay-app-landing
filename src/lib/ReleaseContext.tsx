import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { release } from "../config/site.config";
import { parseManifest, type ReleaseManifest } from "./release";

export type ReleaseStatus = "loading" | "ready" | "unavailable";

interface ReleaseState {
  status: ReleaseStatus;
  manifest: ReleaseManifest | null;
}

const ReleaseContext = createContext<ReleaseState>({
  status: "loading",
  manifest: null,
});

/** One retry: mobile networks drop the first request more often than not. */
const RETRY_AFTER_MS = 2500;

export function ReleaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ReleaseState>({
    status: "loading",
    manifest: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    let timer = 0;

    async function load(attempt: number) {
      try {
        const response = await fetch(release.manifestUrl, {
          signal: controller.signal,
          // Revalidate rather than reuse blindly, so a newly published
          // release shows up without a rebuild.
          cache: "no-cache",
        });
        if (!response.ok) throw new Error(`manifest responded ${response.status}`);

        const manifest = parseManifest(await response.json());
        if (cancelled) return;
        setState(
          manifest
            ? { status: "ready", manifest }
            : { status: "unavailable", manifest: null },
        );
      } catch (error) {
        if (cancelled || (error as Error)?.name === "AbortError") return;

        if (attempt === 0) {
          timer = window.setTimeout(() => load(1), RETRY_AFTER_MS);
          return;
        }
        setState({ status: "unavailable", manifest: null });
      }
    }

    load(0);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  return <ReleaseContext.Provider value={state}>{children}</ReleaseContext.Provider>;
}

export function useRelease(): ReleaseState {
  return useContext(ReleaseContext);
}
