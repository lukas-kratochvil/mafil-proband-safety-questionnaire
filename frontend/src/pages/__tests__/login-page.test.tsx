import i18n from "@i18n";
import LoginPage from "@pages/LoginPage";
import { render } from "@test-utils";

//----------------------------------------------------------------------
// Mocking LanguageMenu due to undefined i18n instance that is used inside this component
//----------------------------------------------------------------------
vi.mock("@components/header/LanguageMenu", () => ({
  LanguageMenu: () => <div />,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
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
