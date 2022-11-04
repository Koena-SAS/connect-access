Feature("Admin Mediation requests detail");

BeforeSuite(({ I }) => {
  I.runDjangoCommand("createmediationsfortest");
  I.runDjangoCommand("createtracereportsfortest");
});

AfterSuite(({ I }) => {
  I.runDjangoCommand("deletemediations");
  I.runDjangoCommand("deletetracereports");
});

Before(({ I }) => {
  I.preparePage();
});

Scenario(`Manage trace reports`, ({ I }) => {
  /**
   * See existing trace reports listed in "Trace reports" page
   */
  I.loginAsAdmin();
  I.click("Admin");
  I.click("All requests");
  I.click("Details");
  I.click("Trace reports");
  I.see("Called Roman and made clear the problem");
  I.see("John");
  I.see("Mediator");
  I.see("Complainant");
  I.see("Sent an email to the organization to explain the issue");
  I.checkA11y();

  /**
   * Add a new trace report, see it among the trace reports' list, then delete it
   */
  I.click("Add a trace report");
  I.fillField("Sender type", "EXTERNAL_ORGANIZATION");
  I.fillField("Comment", "The organization sent us a response");
  I.attachFile("Attached file", "../test_data/white.jpg");
  I.checkA11y();
  I.click("Add the report");
  I.waitForInvisible(".MuiDialog-root"); // to let the modal disappear
  I.see("External organization");
  I.see("The organization sent us a response");
  I.see("Download the file");
  I.click("Remove");
  I.checkA11y();
  I.click("Yes");
  I.waitForInvisible(".MuiDialog-root"); // to let the modal disappear
  I.dontSee("The organization sent us a response");

  /**
   * Edit an existing trace report and see it edited
   */
  // first edition: we add a file and change the comment
  I.click("Edit");
  I.fillField("Sender type", "OTHER");
  I.fillField("Sender name", "Paul");
  I.fillField("Comment", "The organization sent us an excellent response!");
  I.attachFile("Attached file", "../test_data/white.jpg");
  I.checkA11y();
  I.click("Edit the report");
  I.waitForInvisible(".MuiDialog-root"); // to let the modal disappear
  I.see("Other");
  I.see("Paul");
  I.see("The organization sent us an excellent response!");
  I.dontSee("The organization sent us a response");
  I.see("Download the file");
  // second edition: we remove the file and change the comment
  I.click("Edit");
  I.fillField("Comment", "The organization sent us a response");
  I.click("Remove the attached file");
  I.click("Edit the report");
  I.waitForInvisible(".MuiDialog-root"); // to let the modal disappear
  I.dontSee("The organization sent us an excellent response!");
  I.see("The organization sent us a response");
  I.dontSee("Download the file");
  I.click("Connect Access");
  I.click("Logout");
}).retry(1);

Scenario(`Manage mediation requests`, ({ I }) => {
  /**
   * See mediation request's detail
   */
  I.loginAsAdmin();
  I.click("Admin");
  I.click("All requests");
  I.click("Details");
  I.waitForValue("//input", "Roman");
  I.waitForValue("//input", "roman@koena.net");
  I.waitForValue("//textarea", "Difficulties to connect.");
  I.waitForValue("//select", "WAITING_CONTACT");
  I.checkA11y();

  /**
   * Edit mediation request and see it edited
   */
  // first edition: we add a file and change values
  I.fillField("Request status", "MEDIATING");
  I.fillField("First name", "John");
  I.fillField("Last name", "Doe");
  I.fillField("E-mail", "john.doe@example.com");
  I.fillField("What was the issue?", "Something else");
  I.attachFile("Do not hesitate to upload any file", "../test_data/white.jpg");
  I.click("Update the request");
  I.click("Close message");
  I.waitForValue("//input", "John");
  I.waitForValue("//input", "Doe");
  I.waitForValue("//input", "john.doe@example.com");
  I.waitForValue("//textarea", "Something else");
  I.waitForValue("//select", "MEDIATING");
  //pause();
  I.see("Download the current attached file");
  // second edition: we remove the file and values
  I.fillField("First name", "Jane");
  I.click("Remove the attached file");
  I.click("Update the request");
  I.click("Close message");
  I.waitForValue("//input", "Jane");
  I.dontSee("Download the current attached file");

  /**
   * Remove mediation request
   */
  I.click("All requests");
  I.see("Something else");
  I.click("Remove");
  I.click("Yes");
  I.dontSee("Something else");
  I.click("Connect Access");
  I.click("Logout");
}).retry(1);

export {};
