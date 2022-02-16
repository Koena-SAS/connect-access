import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { useContactInformation, useFooterAboutService } from "../hooks";
import LogoBPI from "../images/buildSvg/LogoBpiFrance";
import LogoIDF from "../images/buildSvg/LogoRegionIleDeFrance";
import type { AboutServiceRecieved } from "../types/footerConfiguration";
import type { Langs } from "../types/types";

type FooterProps = RouteComponentProps & {
  /**
   * About service data got from the backend for the first time.
   */
  initialAboutService?: AboutServiceRecieved[];
};

/**
 * Footer content with different pages.
 */
function Footer({ initialAboutService }: FooterProps) {
  const { footerAboutService } = useFooterAboutService(initialAboutService);
  const { contactInformation } = useContactInformation();
  const { i18n } = useLingui();
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
            {contactInformation?.phoneNumber &&
              contactInformation?.phoneNumber[i18n.locale as Langs] && (
                <li>
                  <Trans>Phone number:</Trans>{" "}
                  <a
                    href={`tel:${
                      contactInformation.phoneNumber[i18n.locale as Langs]
                    }`}
                  >
                    {contactInformation.phoneNumberText
                      ? contactInformation.phoneNumberText[i18n.locale as Langs]
                      : contactInformation.phoneNumber[i18n.locale as Langs]}
                  </a>
                </li>
              )}
            {contactInformation?.email &&
              contactInformation.email[i18n.locale as Langs] && (
                <li>
                  <Trans>
                    <span lang="en">E-mail:</span>
                  </Trans>{" "}
                  <a
                    href={`mailto:${
                      contactInformation.email[i18n.locale as Langs]
                    }`}
                  >
                    {contactInformation.emailText
                      ? contactInformation.emailText[i18n.locale as Langs]
                      : contactInformation.email[i18n.locale as Langs]}
                  </a>
                </li>
              )}
            {contactInformation?.website &&
              contactInformation.website[i18n.locale as Langs] && (
                <li>
                  <Trans>
                    <span lang="en">Website:</span>
                  </Trans>{" "}
                  <a
                    href={`mailto:${
                      contactInformation.website[i18n.locale as Langs]
                    }`}
                  >
                    {contactInformation.websiteText
                      ? contactInformation.websiteText[i18n.locale as Langs]
                      : contactInformation.website[i18n.locale as Langs]}
                  </a>
                </li>
              )}
          </ul>
        </div>
        <div className="footer__link-column">
          <h1 className="footer__title">
            <Trans>About</Trans>
          </h1>
          <ul className="footer__list">
            {footerAboutService?.map(function displayListItem(element) {
              const url = element.linkUrl[i18n.locale as Langs];
              return (
                <li key={element.id}>
                  {url.startsWith("http") ? (
                    <a
                      href={element.linkUrl[i18n.locale as Langs]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {element.linkText[i18n.locale as Langs]}
                    </a>
                  ) : (
                    <Link
                      to={{
                        pathname: url,
                      }}
                    >
                      {element.linkText[i18n.locale as Langs]}
                    </Link>
                  )}
                </li>
              );
            })}
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
          <LogoBPI height="100%" role="img" aria-label="BPI France" />
        </div>
        <div className="footer__logoIDF">
          <LogoIDF height="100%" role="img" aria-label="Île-de-France" />
        </div>
      </div>
    </footer>
  );
}

export default withRouter(Footer);
