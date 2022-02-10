import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useContactInformation } from "../hooks";
import { Langs } from "../types/types";

function TermsOfService() {
  const { contactInformation } = useContactInformation();
  const { i18n } = useLingui();
  return (
    <div className="terms-of-service page-base">
      <h1 className="page-base__title">
        <Trans>Terms of service</Trans>
      </h1>
      <div className="page-base__content terms-of-service__content">
        {contactInformation?.termsOfService &&
          contactInformation.termsOfService[i18n.locale as Langs]}
      </div>
    </div>
  );
}

export default TermsOfService;
