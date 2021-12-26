import type { Rule } from "axe-core";

Feature("Identification");

Before(({ I }) => {
  I.preparePage();
});

const a11yIssuesToIgnore: Rule[] = [
  {
    id: "aria-roles",
    selector: "*:not(.MuiDialog-container)",
  },
  {
    id: "color-contrast",
    selector:
      "*:not(.MuiTab-wrapper):not(#email-desc-login):not(.MuiButton-label)",
  },
];

Scenario("Sign in and see user information", ({ I }) => {
  I.checkA11y(a11yIssuesToIgnore);
  I.click("Login");
  within(".identification", () => {
    I.checkA11y(a11yIssuesToIgnore, [["#root"]]);
    I.click("Signup");
    I.fillField("First name", "John");
    I.fillField("Last name", "Doe");
    I.fillField("E-mail", "john.doe@example.com");
    I.fillField("Phone number", "0000000000");
    I.fillField("Password", "strongestpasswordever");
    I.fillField("Confirm password", "strongestpasswordever");
    I.click("Sign up");
  });
  I.see("Logout");
  I.click("Logout");
}).retry(1);

Scenario("Log in and see user information", ({ I }) => {
  I.checkA11y(a11yIssuesToIgnore);
  I.click("Login");
  within(".identification", () => {
    I.checkA11y(a11yIssuesToIgnore, [["#root"]]);
    I.fillField("E-mail", "john.doe@example.com");
    I.fillField("Password", "strongestpasswordever");
    I.click("$loginSubmit");
  });
  I.see("Logout");
  I.click("Logout");
}).retry(1);

export {};
