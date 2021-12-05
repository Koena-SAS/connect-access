import { Trans } from "@lingui/macro";
import type { Langs } from "./types/types";

type QuickLinksProps = {
  siteLanguage: Langs;
  toggleSiteLanguage: () => void;
  excludeFooter?: boolean;
};

/**
 * Small header menu with quick links and toggle language button.
 */
function QuickLinks({
  siteLanguage,
  toggleSiteLanguage,
  excludeFooter = false,
}: QuickLinksProps) {
  const languageButtonLabel = Boolean(siteLanguage === "fr") ? (
    <span lang="en">English</span>
  ) : (
    <span lang="fr">Français</span>
  );
  return (
    <div role="region" aria-label="Accès rapide" className="quick-links">
      <ul className="quick-links__list">
        <li>
          <button onClick={toggleSiteLanguage} className="button">
            {languageButtonLabel}
          </button>
        </li>
        <li>
          <a href="#navigation">
            <Trans>Menu</Trans>
          </a>
        </li>

        <li>
          <a href="#main">
            <Trans>Content</Trans>
          </a>
        </li>
        {!excludeFooter && (
          <li>
            <a href="#footer">
              <Trans>Footer</Trans>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default QuickLinks;
