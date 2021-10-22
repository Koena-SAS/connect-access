import { i18n } from "@lingui/core";
import { en } from "make-plural/plurals";
import { messages as enMessages } from "./locales/en/messages";

export function initLanguagesForTesting() {
  i18n.load({
    en: enMessages,
  });
  i18n.loadLocaleData({
    en: { plurals: en },
  });
  i18n.activate("en");
}
