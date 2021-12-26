import Helper from "@codeceptjs/helper";
import type { Rule } from "axe-core";
import { checkA11y, configureAxe, injectAxe } from "axe-playwright";

/**
 * Helper to check accessibility rules with axe.
 */
class AxeHelper extends Helper {
  async injectAxe(): Promise<void> {
    const { page } = this.helpers.Playwright;
    await injectAxe(page);
  }

  /**
   * Check accessibility issues with axe library.
   * @param {array of object} excludedRulesPerNodes
   *  A list of rule associated to a node to exclude from axe check
   * @param {array of array of string} excludedNodes
   *  The CSS nodes to exclude from axe check
   */
  async checkA11y(
    excludedRulesPerNodes: Rule[] = [],
    excludedNodes: string[] | string[][] = []
  ) {
    const { page } = this.helpers.Playwright;
    await configureAxe(page, {
      // cf. https://github.com/dequelabs/axe-core/issues/1785#issuecomment-733861005
      rules: excludedRulesPerNodes,
    });
    await checkA11y(
      page,
      {
        exclude: [["#djDebug"], ...excludedNodes],
      },
      {
        axeOptions: {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        },
        detailedReport: true,
        detailedReportOptions: { html: true },
      }
    );
  }
}

export = AxeHelper;
