import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render } from "@testing-library/react";
import React from "react";
import { initLanguagesForTesting } from "../i18nTestHelper";
import Warning from "./Warning";

initLanguagesForTesting();

const TestingProvider = ({ children }) => (
  <I18nProvider i18n={i18n}>{children}</I18nProvider>
);

it("displays the given warning text", () => {
  const { queryByText } = render(<Warning text="Some text" />, {
    wrapper: TestingProvider,
  });
  const warningText = queryByText("Some text");
  expect(warningText).toBeInTheDocument();
});
