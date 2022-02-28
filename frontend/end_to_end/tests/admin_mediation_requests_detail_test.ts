Feature("Admin Mediation requests detail");

BeforeSuite(({ I }) => {
  I.runDjangoCommand("createmediationsfortest");
});

AfterSuite(({ I }) => {
  I.runDjangoCommand("deletemediations");
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
  // second edition: we add remove the dile and change the comment
  I.click("Edit");
  I.fillField("Comment", "The organization sent us a response");
  I.click("Remove the attached file");
  I.checkA11y();
  I.click("Edit the report");
  I.waitForInvisible(".MuiDialog-root"); // to let the modal disappear
  I.dontSee("The organization sent us an excellent response!");
  I.see("The organization sent us a response");
  I.dontSee("Download the file");
  I.click("Connect Access");
  I.click("Logout");
}).retry(1);

export {};
