import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { initLanguagesForTesting } from "../i18nTestHelper";
import Information from "./Information";

initLanguagesForTesting();

const TestingProvider = ({ children }: { children: ReactNode }) => (
  <I18nProvider i18n={i18n}>{children}</I18nProvider>
);

it("displays the given info text", () => {
  const { queryByText } = render(<Information text="Some text" />, {
    wrapper: TestingProvider,
  });
  const warningText = queryByText("Some text");
  expect(warningText).toBeInTheDocument();
});
