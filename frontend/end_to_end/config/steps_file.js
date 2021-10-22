// in this file you can append custom step methods to 'I' object

module.exports = function () {
  return actor({
    preparePage: function (page = "/") {
      this.amOnPage("/");
      this.injectAxe();
      tryTo(() => this.click("English")); // eslint-disable-line no-undef
      tryTo(() => this.click("Masquer")); // eslint-disable-line no-undef
    },
    signup: function (
      email = "john.doe@koena.net",
      password = "strongestpasswordever"
    ) {
      this.click("Login");
      within(".identification", () => {
        this.click("Signup");
        this.fillField("First name", "John");
        this.fillField("Last name", "Doe");
        this.fillField("E-mail", email);
        this.fillField("Phone number", "0000000000");
        this.fillField("Password", password);
        this.fillField("Confirm password", "strongestpasswordever");
        this.click("Sign up");
      });
    },
    login: function (
      email = "john.doe@koena.net",
      password = "strongestpasswordever"
    ) {
      this.click("Login");
      within(".identification", () => {
        this.fillField("E-mail", email);
        this.fillField("Password", password);
        this.click("$loginSubmit");
      });
      this.waitForInvisible(".MuiDialog-root"); // to let the modal disappear
    },
    loginAsAdmin: function () {
      this.click("Login");
      within(".identification", () => {
        this.fillField("E-mail", "admin@admin.com");
        this.fillField("Password", "admin");
        this.click("$loginSubmit");
      });
      this.waitForInvisible(".MuiDialog-root"); // to let the modal disappear
    },
  });
};
