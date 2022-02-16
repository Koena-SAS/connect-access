import { useLingui } from "@lingui/react";
import { useContactInformation } from ".";
import { Langs } from "../types/types";

/**
 * @returns false if the terms of service page content is empty for this language
 *  and true if it is not empty.
 */
function useTermsOfServiceIsSet() {
  const { contactInformation } = useContactInformation();
  const { i18n } = useLingui();
  const termsOfServiceIsSet =
    contactInformation?.termsOfService &&
    contactInformation.termsOfService[i18n.locale as Langs];
  return termsOfServiceIsSet;
}

export { useTermsOfServiceIsSet };
