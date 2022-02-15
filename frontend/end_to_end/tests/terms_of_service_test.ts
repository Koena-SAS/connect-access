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

export {};
