import matchers, { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

// Extends Vitest's expect() method with methods from react-testing-library
declare global {
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface JestAssertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
}
expect.extend(matchers);

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(cleanup);
