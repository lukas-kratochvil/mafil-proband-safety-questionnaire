import matchers, { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import i18n from "@app/i18n";

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
  await i18n.changeLanguage("cimode");
});

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(cleanup);
