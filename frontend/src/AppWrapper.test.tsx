import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { fr } from "make-plural/plurals";
import AppWrapper from "./AppWrapper";
import { initLanguagesForTesting } from "./i18nTestHelper";
import { messages as frMessages } from "./locales/fr/messages";
import { configData } from "./testUtils";

jest.mock(
  "react-markdown",
  () =>
    ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    }
);

initLanguagesForTesting();
i18n.load({
  fr: frMessages,
});
i18n.loadLocaleData({
  fr: { plurals: fr },
});

beforeEach(() => {
  window.SERVER_DATA = {
    initialLanguage: "en",
    configData: configData,
  };
});

function renderAppWrapper() {
  return render(
    <I18nProvider i18n={i18n}>
      <AppWrapper />
    </I18nProvider>
  );
}

it("updates html element lang when language button is pressed", async () => {
  const { getByText } = renderAppWrapper();
  const languageButton = getByText("Français");
  expect(document.documentElement.lang).toEqual("en");
  fireEvent.click(languageButton);
  await waitFor(() => expect(document.documentElement.lang).toEqual("fr"));
  fireEvent.click(languageButton);
  await waitFor(() => expect(document.documentElement.lang).toEqual("en"));
});
