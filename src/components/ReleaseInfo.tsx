import { useRelease } from "../lib/ReleaseContext";
import { formatBytes, formatUpdatedAt } from "../lib/release";

export default function ReleaseInfo() {
  const { status, manifest } = useRelease();

  if (status === "loading") {
    return <p className="release release--muted">Checking for the latest version…</p>;
  }

  if (status !== "ready" || !manifest) return null;

  const parts = [
    manifest.versionName ? `Version ${manifest.versionName}` : "",
    formatBytes(manifest.sizeBytes),
    manifest.updatedAt ? `Updated ${formatUpdatedAt(manifest.updatedAt)}` : "",
    manifest.android?.minAndroidVersion
      ? `Android ${manifest.android.minAndroidVersion}+`
      : "",
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return <p className="release">{parts.join("  •  ")}</p>;
}
