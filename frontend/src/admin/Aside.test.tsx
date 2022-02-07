import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  fireEvent,
  render,
  RenderResult,
  within,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import { PATHS_WITHOUT_PREFIX } from "../constants/paths";
import ConfigDataContext from "../contexts/configData";
import { initLanguagesForTesting } from "../i18nTestHelper";
import { configData } from "../testUtils";
import Aside from "./Aside";

initLanguagesForTesting();

function renderAside(history?: any, generatedPaths?: any, paths?: any) {
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
    <ConfigDataContext.Provider value={configData}>
      <I18nProvider i18n={i18n}>
        <Router history={history}>
          <Route path={paths.ROOT}>
            <Aside />
          </Route>
        </Router>
      </I18nProvider>
    </ConfigDataContext.Provider>
  );
}

describe("Accessibility", () => {
  it(`switches to the next accordion title when using the down arrow, until
  the last title`, () => {
    const app = renderAside();
    const titleButtons = getTitleButtons(app);
    titleButtons[0].focus();
    for (let i = 0; i < titleButtons.length; i++) {
      expect(titleButtons[i]).toHaveFocus();
      fireEvent.keyDown(titleButtons[i], {
        key: "ArrowDown",
        code: "ArrowDown",
      });
    }
    expect(titleButtons[titleButtons.length - 1]).toHaveFocus();
  });

  it(`switches to the previous accordion title when using the up arrow, until
  the first title.`, () => {
    const app = renderAside();
    const titleButtons = getTitleButtons(app);
    titleButtons[titleButtons.length - 1].focus();
    for (let i = titleButtons.length - 1; i >= 0; i--) {
      expect(titleButtons[i]).toHaveFocus();
      fireEvent.keyDown(titleButtons[i], {
        key: "ArrowUp",
        code: "ArrowUp",
      });
    }
    expect(titleButtons[0]).toHaveFocus();
  });

  it(`switches to the first accordion title when using the home key`, () => {
    const app = renderAside();
    const titleButtons = getTitleButtons(app);
    titleButtons[2].focus();
    fireEvent.keyDown(titleButtons[2], {
      key: "Home",
      code: "Home",
    });
    expect(titleButtons[0]).toHaveFocus();
    fireEvent.keyDown(titleButtons[0], {
      key: "Home",
      code: "Home",
    });
    expect(titleButtons[0]).toHaveFocus();
  });

  it(`switches to the last accordion title when using the end key`, () => {
    const app = renderAside();
    const titleButtons = getTitleButtons(app);
    titleButtons[1].focus();
    fireEvent.keyDown(titleButtons[1], {
      key: "End",
      code: "End",
    });
    expect(titleButtons[titleButtons.length - 1]).toHaveFocus();
    fireEvent.keyDown(titleButtons[titleButtons.length - 1], {
      key: "End",
      code: "End",
    });
    expect(titleButtons[titleButtons.length - 1]).toHaveFocus();
  });

  function getTitleButtons(app: RenderResult) {
    const titleButtons = app
      .getAllByRole("heading", {
        level: 2,
      })
      .map(function getTitleButton(element: HTMLElement) {
        return within(element).getByRole("button");
      });
    expect(titleButtons.length).toBeGreaterThan(2);
    return titleButtons;
  }
});
