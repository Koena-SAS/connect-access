Feature("Mediation request");

Before(({ I }) => {
  I.preparePage();
  I.have("user", { email: "user.mediations@example.com" });
});

Scenario(
  `Create a mediation request and see it in mediation requests
 list and mediation request detail.`,
  ({ I }) => {
    I.login("user.mediations@example.com", "strongestpasswordever");
    I.fillField("First name", "Bill");
    I.fillField("Last name", "Blue");
    I.fillField("E-mail", "bill@example.com");
    I.checkA11y();
    I.click("Step 2: Your problem");
    I.click("Internet Explorer");
    I.fillField("Describe every step", "I try to load the page");
    I.fillField("What was the issue", "It fails to load");
    I.checkA11y();
    I.click("Step 3: The organization");
    I.fillField("Name of the organization", "Anonymous group");
    I.fillField("E-mail", "contact@anonymous.org");
    I.fillField("Contact", "Rachid");
    I.checkA11y();
    I.click("Step 4: Summary");
    I.checkA11y();
    I.click("Submit my mediation request");
    I.click("Close message");
    I.fillField("First name", "John");
    I.fillField("Last name", "Doe");
    I.fillField("E-mail", "john@doe.com");
    I.click("Step 2: Your problem");
    I.click("Firefox");
    I.fillField("Describe every step", "I try to load the page");
    I.fillField(
      "What was the issue",
      "It loads but I don't get all the informaiton"
    );
    I.click("Step 3: The organization");
    I.fillField("Name of the organization", "Koena company");
    I.fillField("E-mail", "roman@example.com");
    I.fillField("Contact", "Roman");
    I.click("Step 4: Summary");
    I.click("Submit my mediation request");
    I.click("Close message");
    I.click("My requests");
    I.see("Koena company");
    I.checkA11y();
    I.see("Anonymous group");
    I.click("Details");
    I.see("Internet Explorer");
    I.see("Rachid");
    I.checkA11y();
  }
).retry(1);

export {};
