Feature("User details");

Before(({ I }) => {
  I.preparePage();
  I.have("user", { first_name: "John", email: "user.details@example.com" });
});

Scenario(
  `Log in and see personal information.
Then change these information.`,
  ({ I }) => {
    I.login("user.details@example.com", "strongestpasswordever");
    I.click("My account");
    I.click("My account");
    I.click("My account");
    I.see("Personal information");
    I.seeInField("First name", "John");
    I.checkA11y();

    I.click("My account");
    I.click("My account");
    I.click("My account");
    I.seeInField("First name", "John");
    I.fillField("First name", "Chang");
    I.click("Validate your new personal information");
    I.seeInField("First name", "Chang");
    I.checkA11y();
    I.click("Close message");
    I.refreshPage();
    I.seeInField("First name", "Chang");
    I.click("Logout");
  }
).retry(1);

export {};
