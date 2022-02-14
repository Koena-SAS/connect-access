// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { initLanguagesForTesting } from "./i18nTestHelper";

// with default 5 secodns the tests sometimes fail in the CI, 15 seconds seems ok
jest.setTimeout(15000);

initLanguagesForTesting();
