import { app } from "../config/site.config";
import AppIcon from "./AppIcon";
import DownloadMenu from "./DownloadMenu";
import ReleaseInfo from "./ReleaseInfo";

export default function AppIdentity() {
  return (
    <section className="identity" aria-label="App information">
      <div className="identity__head">
        <div className="identity__icon">
          <AppIcon />
        </div>

        <div className="identity__meta">
          <h1 className="identity__name">{app.name}</h1>
          <p className="identity__tagline">{app.tagline}</p>
          <p className="identity__developer">{app.developer}</p>
        </div>
      </div>

      <DownloadMenu />
      <ReleaseInfo />
    </section>
  );
}
