import { t, Trans } from "@lingui/macro";
import React from "react";
import LogoBPI from "../images/buildSvg/LogoBpiFrance";
import LogoIDF from "../images/buildSvg/LogoRegionIleDeFrance";

/**
 * Footer content with different pages.
 */
function Footer() {
  return (
    <footer
      role="contentinfo"
      id="footer"
      className="customer-layout__footer footer"
    >
      <div className="footer__links">
        <div className="footer__link-column">
          <h1 className="footer__title">
            <Trans>Contact us</Trans>
          </h1>
          <ul className="footer__list">
            <li>
              <Trans>Phone number:</Trans>{" "}
              <a href="tel:+33972632128">+33 (0)9 72 63 21 28</a>
            </li>
            <li>
              <Trans>
                <span lang="en">E-mail:</span>
              </Trans>{" "}
              <a href="mailto:mediation@koena.net">mediation@koena.net</a>
            </li>
          </ul>
        </div>
        <div className="footer__link-column">
          <h1 className="footer__title">
            <Trans>About</Trans>
          </h1>
          <ul className="footer__list">
            <li>
              <a
                href="https://koena.net/faq-koena-connect/"
                target="_blank"
                rel="noreferrer"
              >
                <Trans>About us</Trans>
              </a>
            </li>
            <li>
              <a
                href={t`https://koena.net/en/legal-information-and-credits/`}
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Legal information</Trans>
              </a>
            </li>
            <li>
              <a
                href={t`https://koena.net/en/koenas-privacy/`}
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Privacy</Trans>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer__link-column">
          <h1 className="footer__title">
            <Trans>Utilization</Trans>
          </h1>
          <ul className="footer__list">
            <li>
              <Trans>Help</Trans>
            </li>
            <li>
              <Trans>Sitemap</Trans>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__sponsors">
        <p className="footer__sponsors-text">
          <Trans>Project funded as part of the Innov'Up experimentation</Trans>
        </p>
        <div className="footer__logoBPI">
          <LogoBPI height="100%" />
        </div>
        <div className="footer__logoIDF">
          <LogoIDF height="100%" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
