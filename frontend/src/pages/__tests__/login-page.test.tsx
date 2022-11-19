import { render } from "@test-utils";
import i18n from "src/i18n";
import { LoginPage } from "../LoginPage";

describe("login page", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", () => {
    const { container } = render(<LoginPage />);

    expect(container).toHaveTextContent(/loginPage.title/);
    expect(container).toHaveTextContent(/loginPage.loginText/);
  });
});
