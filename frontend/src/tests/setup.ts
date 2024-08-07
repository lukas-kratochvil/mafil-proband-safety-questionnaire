import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import i18n from "@app/i18n/i18n";
import { NEUTRAL_LANGUAGE_CODE } from "./neutral-language-code";

// Set neutral language before each test case
beforeEach(async () => {
  await i18n.changeLanguage(NEUTRAL_LANGUAGE_CODE);
});

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(cleanup);
