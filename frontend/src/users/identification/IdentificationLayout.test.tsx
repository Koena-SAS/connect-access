import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import { Route, Router } from "react-router-dom";
import type { Paths } from "../../constants/paths";
import { PATHS_WITHOUT_PREFIX } from "../../constants/paths";
import ConfigDataContext from "../../contexts/configData";
import ContactInformationContext from "../../contexts/contactInformation";
import {
  click,
  configData,
  runWithAndWithoutOrganizationPrefix,
} from "../../testUtils";
import {
  axiosGetResponseContactInformation,
  mockedAxios,
  resetAxiosMocks,
} from "../../__mocks__/axiosMock";
import { fillResetPasswordFields } from "../password/testUtils";
import IdentificationLayout from "./IdentificationLayout";
import { fillLoginFields, fillSignupFields } from "./testUtils";

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Cancel button", () => {
  it(`does not display login form and changes path to previous path when clicking
  on cancel button from login modal first step`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.REGISTER);
        history.push(generatedPaths.REGISTER);
        history.push({
          pathname: generatedPaths.LOGIN,
          state: {
            from: generatedPaths.ROOT,
          },
        });
        const { getByText, queryByTestId } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        const cancelButton = getByText("Cancel");
        await click(cancelButton);
        await waitFor(() =>
          expect(queryByTestId("loginSubmit")).not.toBeInTheDocument()
        );
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
      }
    );
  });

  it(`does not display register form and changes path to previous path when clicking
to cancel button from register modal`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.LOGIN);
        history.push(generatedPaths.LOGIN);
        history.push({
          pathname: generatedPaths.REGISTER,
          state: {
            from: generatedPaths.ROOT,
          },
        });
        const { getByText, queryByText } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        const cancelButton = getByText("Cancel");
        await click(cancelButton);
        await waitFor(() =>
          expect(queryByText("Sign up")).not.toBeInTheDocument()
        );
        expect(history.location.pathname).toEqual(generatedPaths.ROOT);
      }
    );
  });

  it(`always goes back to login path when on reset password
path and clicking on cancel button `, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.RESET_PASSWORD);
        const { getByTestId, queryByText, getByText } =
          renderIdentificationLayout(history, generatedPaths, paths);
        const cancelButton = getByText("Cancel");
        await click(cancelButton);
        await waitFor(() =>
          expect(queryByText("Reset password")).not.toBeInTheDocument()
        );
        expect(getByTestId("loginSubmit")).toBeInTheDocument();
        expect(history.location.pathname).toEqual(generatedPaths.LOGIN);
      }
    );
  });
});

describe("Submit button unsuccessful", () => {
  it(`keeps displaying login form when we validate the form without
  entering anyhthing, when logging in with password`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push({
          pathname: generatedPaths.LOGIN,
          state: {
            from: generatedPaths.ROOT,
          },
        });
        const { getByTestId, getByLabelText } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        await click(getByLabelText(/with password/));
        await click(getByTestId("loginSubmit"));
        expect(getByTestId("loginSubmit")).toBeInTheDocument();
        expect(history.location.pathname).toEqual(generatedPaths.LOGIN);
      }
    );
  });
  it(`keeps displaying login form when we validate the form without
  entering anyhthing, when logging in without password`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await clickSubmitUnsuccessful(
          generatedPaths.LOGIN,
          generatedPaths,
          paths,
          "loginSubmit",
          true
        );
      }
    );
  });
  it(`keeps displaying signup form when we validate the form without
  entering anyhthing`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await clickSubmitUnsuccessful(
          generatedPaths.REGISTER,
          generatedPaths,
          paths,
          "Sign up"
        );
      }
    );
  });
  it(`keeps displaying reset password form when we validate the form without
  entering anyhthing`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await clickSubmitUnsuccessful(
          generatedPaths.RESET_PASSWORD,
          generatedPaths,
          paths,
          "Reset password"
        );
      }
    );
  });

  async function clickSubmitUnsuccessful(
    generatedPath: string,
    generatedPaths: Paths,
    paths: Paths,
    submitText: string,
    shoulGetByTestId: boolean = false
  ) {
    const history = createMemoryHistory();
    history.push({
      pathname: generatedPath,
      state: {
        from: generatedPaths.ROOT,
      },
    });
    const { getByText, getByTestId } = renderIdentificationLayout(
      history,
      generatedPaths,
      paths
    );
    let submitButton;
    if (shoulGetByTestId) {
      submitButton = getByTestId(submitText);
    } else {
      submitButton = getByText(submitText);
    }
    await click(submitButton);
    expect(submitButton).toBeInTheDocument();
    expect(history.location.pathname).toEqual(generatedPath);
  }
});

describe("Submit button successful", () => {
  it(`does not display login form anymore when it was successful`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await clickSubmitSuccessful(
          generatedPaths.LOGIN,
          generatedPaths.ROOT,
          generatedPaths,
          paths,
          "loginSubmit",
          (app: RenderResult) => fillLoginFields(app, null, 2),
          true
        );
      }
    );
  });

  it(`does not display signup form anymore when it was successful`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await clickSubmitSuccessful(
          generatedPaths.REGISTER,
          generatedPaths.ROOT,
          generatedPaths,
          paths,
          "Sign up",
          fillSignupFields
        );
      }
    );
  });

  it(`does not display reset password form anymore when it was successful`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        await clickSubmitSuccessful(
          generatedPaths.RESET_PASSWORD,
          generatedPaths.LOGIN,
          generatedPaths,
          paths,
          "Reset password",
          fillResetPasswordFields
        );
      }
    );
  });

  async function clickSubmitSuccessful(
    initialGeneratedPath: string,
    finalGeneratedPath: string,
    generatedPaths: Paths,
    paths: Paths,
    submitText: string,
    fillFields: (app: RenderResult) => void,
    shoulGetByTestId: boolean = false
  ) {
    const history = createMemoryHistory();
    history.push({
      pathname: initialGeneratedPath,
      state: {
        from: generatedPaths.ROOT,
      },
    });
    const app = renderIdentificationLayout(history, generatedPaths, paths);
    const { getByText, getByTestId } = app;
    let submitButton: HTMLElement;
    if (shoulGetByTestId) {
      submitButton = getByTestId(submitText);
    } else {
      submitButton = getByText(submitText);
    }
    await fillFields(app);
    await click(submitButton);
    await waitFor(() => expect(submitButton).not.toBeInTheDocument());
    expect(history.location.pathname).toEqual(finalGeneratedPath);
  }
});

describe("Reset password notifications", () => {
  it(`displays an error message when the backend replies with an error`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.RESET_PASSWORD);
        const app = renderIdentificationLayout(history, generatedPaths, paths);
        const { getByText } = app;
        mockedAxios.post.mockRejectedValue({
          response: {
            data: "error",
          },
        });
        await fillResetPasswordFields(app);
        const error = await waitFor(() =>
          getByText("An error occured, please try again.")
        );
        expect(error).toBeInTheDocument();
      }
    );
  });

  it(`displays a notification message when the backend replies with success`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.RESET_PASSWORD);
        const app = renderIdentificationLayout(history, generatedPaths, paths);
        const { getByText } = app;
        await fillResetPasswordFields(app);
        const info = await waitFor(() =>
          getByText(
            "If an account exists with this e-mail, you will receive a password reset link soon."
          )
        );
        expect(info).toBeInTheDocument();
      }
    );
  });
});

describe("Password reset or identification block", () => {
  it(`displays password reset request block (and no more identification block)
when clicking on forgot password link in login modal`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.LOGIN);
        const { getByText, queryByTestId, queryByText, getByLabelText } =
          renderIdentificationLayout(history, generatedPaths, paths);
        await click(getByLabelText(/with password/));
        await click(getByText("Password forgotten?"));
        expect(history.location.pathname).toEqual(
          generatedPaths.RESET_PASSWORD
        );
        const resetButton = getByText("Reset password");
        const loginButton = queryByTestId("loginSubmit");
        const signupButton = queryByText("Sign up");
        expect(resetButton).toBeInTheDocument();
        expect(loginButton).not.toBeInTheDocument();
        expect(signupButton).not.toBeInTheDocument();
      }
    );
  });

  it(`displays identification block (and no more password reset block)
when clicking on login modal`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.LOGIN);
        const { queryByText, getByTestId } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        const resetButton = queryByText("Reset password");
        const loginButton = getByTestId("loginSubmit");
        expect(resetButton).not.toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
      }
    );
  });
});

describe("Focus management", () => {
  it(`moves focus to the first focusable element on open, when path is
  /login`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.LOGIN);
        const { getByRole } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        const loginTab = getByRole("tab", { name: "Log in" });
        expect(loginTab).toHaveFocus();
      }
    );
  });

  it(`moves focus to the first focusable element on open, when path is
  /register`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.REGISTER);
        const { getByRole } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        const registerTab = getByRole("tab", { name: "Signup" });
        expect(registerTab).toHaveFocus();
      }
    );
  });

  it(`moves focus to the first focusable element on open, when path is
  /reset-password`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.RESET_PASSWORD);
        const { getByLabelText } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        const emailField = getByLabelText(/E-mail/);
        expect(emailField).toHaveFocus();
      }
    );
  });
});

describe("Modal aria label", () => {
  it(`displays correct aria-label for the modal main element, when path is
  /login`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.LOGIN);
        const { getByLabelText } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        const loginTab = getByLabelText("Identification - Login");
        expect(loginTab).toBeInTheDocument();
      }
    );
  });

  it(`displays correct aria-label for the modal main element, when path is
  /register`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.REGISTER);
        const { getByLabelText } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        const loginTab = getByLabelText("Identification - Signup");
        expect(loginTab).toBeInTheDocument();
      }
    );
  });

  it(`displays correct aria-label for the modal main element, when path is
  /reset-password`, async () => {
    await runWithAndWithoutOrganizationPrefix(
      async (generatedPaths: Paths, paths: Paths) => {
        const history = createMemoryHistory();
        history.push(generatedPaths.RESET_PASSWORD);
        const { getByLabelText } = renderIdentificationLayout(
          history,
          generatedPaths,
          paths
        );
        const loginTab = getByLabelText("Identification - Reset your password");
        expect(loginTab).toBeInTheDocument();
      }
    );
  });
});

function renderIdentificationLayout(
  history: History,
  generatedPaths: Paths,
  paths: Paths
) {
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
      <ContactInformationContext.Provider
        value={axiosGetResponseContactInformation.data}
      >
        <I18nProvider i18n={i18n}>
          <Router history={history}>
            <Route path={paths.ROOT}>
              <IdentificationLayout setToken={() => null} isLogged={false} />
            </Route>
          </Router>
        </I18nProvider>
      </ContactInformationContext.Provider>
    </ConfigDataContext.Provider>
  );
}
