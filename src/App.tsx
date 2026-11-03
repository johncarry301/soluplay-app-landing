import AppIdentity from "./components/AppIdentity";
import SafetyIndicator from "./components/SafetyIndicator";
import ScreenshotGallery from "./components/ScreenshotGallery";
import RatingsReviews from "./components/RatingsReviews";
import SiteFooter from "./components/SiteFooter";
import { ReleaseProvider } from "./lib/ReleaseContext";

export default function App() {
  return (
    <ReleaseProvider>
      <main className="page">
        <div className="shell">
          <div className="product">
            <AppIdentity />
            <SafetyIndicator />
          </div>
        </div>
        <ScreenshotGallery />
        <div className="shell">
          <RatingsReviews />
        </div>
      </main>
      <SiteFooter />
    </ReleaseProvider>
  );
}
