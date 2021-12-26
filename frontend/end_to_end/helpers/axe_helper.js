"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
const helper_1 = __importDefault(require("@codeceptjs/helper"));
const axe_playwright_1 = require("axe-playwright");
/**
 * Helper to check accessibility rules with axe.
 */
class AxeHelper extends helper_1.default {
  async injectAxe() {
    const { page } = this.helpers.Playwright;
    await (0, axe_playwright_1.injectAxe)(page);
  }
  /**
   * Check accessibility issues with axe library.
   * @param {array of object} excludedRulesPerNodes
   *  A list of rule associated to a node to exclude from axe check
   * @param {array of array of string} excludedNodes
   *  The CSS nodes to exclude from axe check
   */
  async checkA11y(excludedRulesPerNodes = [], excludedNodes = []) {
    const { page } = this.helpers.Playwright;
    await (0, axe_playwright_1.configureAxe)(page, {
      // cf. https://github.com/dequelabs/axe-core/issues/1785#issuecomment-733861005
      rules: excludedRulesPerNodes,
    });
    await (0, axe_playwright_1.checkA11y)(
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
module.exports = AxeHelper;
