import { footer } from "../config/site.config";
import AppIcon from "./AppIcon";

export default function SiteFooter() {
  const links = footer.links.filter((link) => link.href.trim() !== "");

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <span className="site-footer__mark">
          <AppIcon rounded={9} />
        </span>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} {footer.copyright}
        </p>
        {links.length > 0 && (
          <nav className="site-footer__links" aria-label="Footer">
            {links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
