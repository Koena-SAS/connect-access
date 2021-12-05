import { i18n } from "@lingui/core";
import { en, fr } from "make-plural/plurals";
import type { Langs } from "./types/types";

export const locales = {
  en: "English",
  fr: "Français",
};

i18n.loadLocaleData({
  en: { plurals: en },
  fr: { plurals: fr },
});

/**
 * We do a dynamic import of just the catalog that we need
 * @param locale any locale string
 */
export async function dynamicActivate(locale: Langs) {
  // @ts-ignore
  if (locale === "{{ language }}") {
    // This hack is here to make the frontend work
    // with the frontend dev server alone, without
    // needing the language given by the backend
    locale = "fr";
  }
  const { messages } = await import(`./locales/${locale}/messages.js`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

/**
 * Extracts the language translation from an object containing strings.
 * This method decides the strategy to choose if the translation does
 * not exist.
 * @param locale the locale for which we could like to have
 *    the value, eg. "en"
 * @param object the object having languages as keys, and the
 *    value we are looking for, eg. {en: "blabla", fr: "blabla"}
 * @returns the translation value, eg. "blabla"
 */
export function extractTranslation(
  locale: Langs,
  object: Record<Langs, string>
): string {
  return object ? object[locale] : null;
}
