Feature("Terms of service");

BeforeSuite(({ I }) => {
  I.runDjangoCommand("createconfigurationsfortest");
});

AfterSuite(({ I }) => {
  I.runDjangoCommand("deleteconfigurations");
});

Before(({ I }) => {
  I.preparePage();
});

Scenario(
  `Go to terms of service page, and see that it displays correctly the terms of service`,
  ({ I }) => {
    I.amOnPage("/terms-of-service");
    I.injectAxe();
    I.checkA11y();
    I.see("Terms of service");
    I.see("Terms of service title");
    I.see("Terms of service content");
  }
).retry(1);

Scenario(
  "Sign in and see user information, while terms of service page exist",
  ({ I }) => {
    I.click("Login");
    within(".identification", () => {
      I.click("Signup");
      I.fillField("First name", "Jane");
      I.fillField("Last name", "Doe");
      I.fillField("E-mail", "jane.doe@example.com");
      I.fillField("Phone number", "0000000000");
      I.fillField("Password", "strongestpasswordever");
      I.fillField("Confirm password", "strongestpasswordever");
      I.checkOption("I have read");
      I.click("Sign up");
    });
    I.see("Logout");
    I.click("Logout");
  }
).retry(1);

export {};
