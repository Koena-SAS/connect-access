Feature("Admin Mediation requests");

BeforeSuite(({ I }) => {
  I.runDjangoCommand("createmediationsfortest");
});

AfterSuite(({ I }) => {
  I.runDjangoCommand("deletemediations");
});

Before(({ I }) => {
  I.preparePage();
});

Scenario(
  `See existing mediation requests listed in "All requests" page`,
  ({ I }) => {
    I.loginAsAdmin();
    I.click("Admin");
    I.click("All requests");
    I.see("Difficulties to connect");
    I.see("I have an empty link and I dont know where it points to");
    I.checkA11y();
    I.click("Connect Access");
    I.click("Logout");
  }
).retry(1);

export {};
