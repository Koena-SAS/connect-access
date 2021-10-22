Feature("Translation");

Before(({ I }) => {
  I.preparePage();
});

const a11yIssuesToIgnore = [
  {
    id: "color-contrast",
    selector: "*:not(.button)",
  },
];

Scenario("Translate main page", ({ I }) => {
  I.checkA11y(a11yIssuesToIgnore);
  I.see("Login");
  I.see("Français");
  I.click("Français");
  I.see("Connexion");
  I.see("English");
  I.checkA11y(a11yIssuesToIgnore);
}).retry(1);
