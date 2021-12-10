import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult } from "@testing-library/react";
import type { History } from "history";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import type { Paths } from "../constants/paths";
import { PATHS_WITHOUT_PREFIX } from "../constants/paths";
import { initLanguagesForTesting } from "../i18nTestHelper";
import { mediationRequests } from "../testUtils";
import MediationRequestDetail from "./MediationRequestsDetail";

initLanguagesForTesting();

test.skip(`MediationRequestDetail display is already tested through
the tests of mediationForm/Recap.test.js`, (): void => undefined);

it(`displays h3 titles with titlesHeadingLevel set to 3`, async () => {
  const { getAllByRole } = renderMediationRequestDetail(3);
  expect(getAllByRole("heading", { level: 3 }).length).toEqual(3);
});

it(`displays h3 titles with titlesHeadingLevel set to 2`, async () => {
  const { getAllByRole } = renderMediationRequestDetail(2);
  expect(getAllByRole("heading", { level: 2 }).length).toEqual(3);
});

function renderMediationRequestDetail(
  titlesHeadingLevel: number,
  history?: History,
  generatedPaths?: Paths,
  paths?: Paths
): RenderResult {
  if (!paths) {
    paths = PATHS_WITHOUT_PREFIX;
  }
  if (!history) {
    if (generatedPaths) {
      history = createMemoryHistory({
        initialEntries: [generatedPaths.ROOT],
      });
    } else {
      history = createMemoryHistory();
    }
  }
  return render(
    <I18nProvider i18n={i18n}>
      <Router history={history}>
        <Route path={paths.ROOT}>
          <MediationRequestDetail
            mediationRequest={mediationRequests[0]}
            additionalComponents={undefined}
            titlesHeadingLevel={titlesHeadingLevel}
          />
        </Route>
      </Router>
    </I18nProvider>
  );
}
