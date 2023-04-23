import matchers, { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import i18n from "@app/i18n";
import { NEUTRAL_LANGUAGE_CODE } from "./neutral-language-code";

// Extends Vitest's expect() method with methods from react-testing-library
declare global {
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface JestAssertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
}
expect.extend(matchers);

// Set neutral language before each test case
beforeEach(async () => {
  await i18n.changeLanguage(NEUTRAL_LANGUAGE_CODE);
});

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(cleanup);
