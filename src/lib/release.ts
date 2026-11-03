/* ------------------------------------------------------------------ *
 * Release manifest
 *
 * One JSON file describes the published APKs. The same shape is meant
 * to feed a future in-app updater, so it carries everything a client
 * needs to trust a download: version, size, SHA-256 and the minimum
 * Android version.
 * ------------------------------------------------------------------ */

export type ManifestVariantId = "phone" | "tv";

export interface ManifestVariant {
  label?: string;
  /** Direct link to the release asset, not a release webpage. */
  url: string;
  fileName?: string;
  sizeBytes?: number;
  sha256?: string;
  minSdkVersion?: number;
}

export interface ReleaseManifest {
  schemaVersion: number;
  appId?: string;
  versionCode?: number;
  versionName?: string;
  updatedAt?: string;
  releaseNotes?: string;
  /** Combined APK, used when a variant has no URL of its own. */
  downloadUrl?: string;
  fileName?: string;
  sizeBytes?: number;
  sha256?: string;
  android?: {
    packageName?: string;
    minSdkVersion?: number;
    minAndroidVersion?: string;
    targetSdkVersion?: number;
  };
  variants?: Partial<Record<ManifestVariantId, ManifestVariant>>;
}

export interface ResolvedRelease {
  url: string;
  fileName?: string;
  sizeBytes?: number;
  sha256?: string;
}

/**
 * A manifest is only usable when it actually describes a download. A
 * truncated file or an unrelated JSON document is rejected here so the
 * page falls back to its own configuration instead of offering a dead
 * button.
 */
export function parseManifest(value: unknown): ReleaseManifest | null {
  if (!value || typeof value !== "object") return null;

  const manifest = value as ReleaseManifest;
  const hasVersion =
    typeof manifest.versionName === "string" || typeof manifest.versionCode === "number";
  const hasVariant =
    !!manifest.variants &&
    typeof manifest.variants === "object" &&
    Object.values(manifest.variants).some((variant) => !!variant?.url?.trim());

  if (!hasVersion && !hasVariant) return null;
  return manifest;
}

export function resolveVariant(
  manifest: ReleaseManifest | null,
  variant: ManifestVariantId,
): ResolvedRelease | null {
  if (!manifest) return null;

  const entry = manifest.variants?.[variant];
  const url = (entry?.url || manifest.downloadUrl || "").trim();
  if (!url) return null;

  return {
    url,
    fileName: entry?.fileName || manifest.fileName,
    sizeBytes: entry?.sizeBytes ?? manifest.sizeBytes,
    sha256: entry?.sha256 ?? manifest.sha256,
  };
}

export function formatBytes(bytes: number | undefined): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0) return "";

  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
}

export function formatUpdatedAt(value: string | undefined): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
