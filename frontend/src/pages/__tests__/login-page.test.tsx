import LoginPage from "@app/pages/LoginPage";
import { render } from "@test-utils";

//----------------------------------------------------------------------
// Mocking LanguageMenu due to undefined i18n instance that is used inside this component
//----------------------------------------------------------------------
vi.mock("@app/components/header/LanguageMenu", () => ({
  LanguageMenu: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
vi.mock("@app/hooks/auth/AuthProvider", () => ({
  useAuth: () => ({
    operator: undefined,
  }),
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("login page", () => {
  test("contains translations", () => {
    const { container } = render(<LoginPage />);

    expect(container).toHaveTextContent(/loginPage.title/);
    expect(container).toHaveTextContent(/loginPage.loginText/);
  });
});
