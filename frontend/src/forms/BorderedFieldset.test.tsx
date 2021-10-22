import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render } from "@testing-library/react";
import React from "react";
import { initLanguagesForTesting } from "../i18nTestHelper";
import BorderedFieldset from "./BorderedFieldset";

initLanguagesForTesting();

const TestingProvider = ({ children }) => (
  <I18nProvider i18n={i18n}>{children}</I18nProvider>
);

it("displays the given legend", () => {
  const { queryByText } = render(
    <BorderedFieldset legend="Some text">
      <p>Blabla</p>
    </BorderedFieldset>,
    {
      wrapper: TestingProvider,
    }
  );
  const legendText = queryByText("Some text");
  expect(legendText).toBeInTheDocument();
});

it("displays the given children", () => {
  const { queryByText } = render(
    <BorderedFieldset legend="Some text">
      <p>Child 1</p>
      <p>Child 2</p>
    </BorderedFieldset>,
    {
      wrapper: TestingProvider,
    }
  );
  const child1 = queryByText("Child 1");
  expect(child1).toBeInTheDocument();
  const child2 = queryByText("Child 2");
  expect(child2).toBeInTheDocument();
});

it("displays a title element with the indicated level if given", () => {
  const { getByRole } = render(
    <BorderedFieldset legend="Some text" level={1}>
      <p>Blabla</p>
    </BorderedFieldset>,
    {
      wrapper: TestingProvider,
    }
  );
  const legendTextLevel1 = getByRole("heading", { level: 1 });
  expect(legendTextLevel1).toBeInTheDocument();

  const { getByRole: getByRoleLevel3 } = render(
    <BorderedFieldset legend="Some text" level={3}>
      <p>Blabla</p>
    </BorderedFieldset>,
    {
      wrapper: TestingProvider,
    }
  );
  const legendTextLevel3 = getByRoleLevel3("heading", { level: 3 });
  expect(legendTextLevel3).toBeInTheDocument();
});
