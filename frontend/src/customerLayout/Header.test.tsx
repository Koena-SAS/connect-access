import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { initLanguagesForTesting } from "../i18nTestHelper";
import { mockedAxios, resetAxiosMocks } from "../testUtils";
import Header from "./Header";

initLanguagesForTesting();
jest.mock("axios");

beforeEach(() => {
  resetAxiosMocks();
});

afterEach(async () => {
  jest.clearAllMocks();
  localStorage.clear();
  await waitFor(() => cache.clear());
});

function renderHeader(isLogged = false) {
  return render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <I18nProvider i18n={i18n}>
        <Router>
          <Header
            isLogged={isLogged}
            setToken={() => null}
            token={isLogged ? "blablabla" : null}
          />
        </Router>
      </I18nProvider>
    </SWRConfig>
  );
}

it("displays correct nav items when not logged", () => {
  const { getByText, getByAltText, queryByText } = renderHeader(false);
  const home = getByAltText(/Koena Connect/);
  const login = getByText("Login");
  const logout = queryByText("Logout");
  const myRequests = queryByText("My requests");
  const admin = queryByText("Admin");
  expect(home).toBeInTheDocument();
  expect(login).toBeInTheDocument();
  expect(logout).not.toBeInTheDocument();
  expect(myRequests).not.toBeInTheDocument();
  expect(admin).not.toBeInTheDocument();
});

it("displays correct nav items when logged", async () => {
  const { getByText, getByAltText, queryByText } = renderHeader(true);
  const home = getByAltText(/Koena Connect/);
  const login = queryByText("Login");
  const logout = getByText("Logout");
  const myRequests = getByText("My requests");
  const admin = queryByText("Admin");
  expect(home).toBeInTheDocument();
  expect(login).not.toBeInTheDocument();
  expect(logout).toBeInTheDocument();
  expect(myRequests).toBeInTheDocument();
  expect(admin).not.toBeInTheDocument();
  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
});

it("displays correct nav items when logged as staff", async () => {
  mockedAxios.get.mockResolvedValue({
    data: {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      phone_number: "2463259871",
      isStaff: true,
    },
  });
  const { getByText, getByAltText, queryByText, findByText } =
    renderHeader(true);
  const home = getByAltText(/Koena Connect/);
  const login = queryByText("Login");
  const logout = getByText("Logout");
  const myRequests = getByText("My requests");
  const admin = await findByText("Admin");
  expect(home).toBeInTheDocument();
  expect(login).not.toBeInTheDocument();
  expect(logout).toBeInTheDocument();
  expect(myRequests).toBeInTheDocument();
  expect(admin).toBeInTheDocument();
});

describe("Burger menu", () => {
  it(`sets the focus on the close icon when clicking on the burger icon and
sets it back on the burger icon when clicking on the close icon`, () => {
    const { getByLabelText } = renderHeader(false);
    getByLabelText(/Open the menu/).focus();
    fireEvent.click(getByLabelText(/Open the menu/));
    expect(getByLabelText(/Close the menu/)).toHaveFocus();
    fireEvent.click(getByLabelText(/Close the menu/));
    expect(getByLabelText(/Open the menu/)).toHaveFocus();
  });

  it(`sets correctly aria-expanded property on the burger and close buttons
  when opening and lcosing the menu`, () => {
    const { getByLabelText, getByRole } = renderHeader(false);
    fireEvent.click(getByLabelText(/Open the menu/));
    expect(
      getByRole("button", { name: /Close the menu/, expanded: true })
    ).toBeInTheDocument();
    fireEvent.click(getByLabelText(/Close the menu/));
    expect(
      getByRole("button", { name: /Open the menu/, expanded: false })
    ).toBeInTheDocument();
  });
});
