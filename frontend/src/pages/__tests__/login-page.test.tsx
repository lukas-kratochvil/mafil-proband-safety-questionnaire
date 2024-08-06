import { userEvent } from "@testing-library/user-event";
import * as auth from "@app/hooks/auth/auth";
import LoginPage from "@app/pages/LoginPage";
import { render, screen } from "@test-utils";

//----------------------------------------------------------------------
// Mocking LanguageMenu due to undefined i18n instance that is used inside this component
//----------------------------------------------------------------------
vi.mock("@app/components/header/LanguageMenu", () => ({
  LanguageMenu: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
vi.mock("@app/hooks/auth/auth", () => ({
  useAuth: () => ({
    operator: undefined,
  }),
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("login page", () => {
  const setup = () => {
    render(<LoginPage />);
  };

  test("contains translations", () => {
    // ACT
    setup();
    const title = screen.getByText(/loginPage.title/);
    const text = screen.getByText(/loginPage.loginText/);

    // ASSERT
    expect(title).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  describe("login with provider", () => {
    test("MUNI OIDC provider", async () => {
      // ARRANGE
      const user = userEvent.setup();
      const useAuthSpy = vi.spyOn(auth, "useAuth");
      const mockedLogIn = vi.fn();
      useAuthSpy.mockReturnValueOnce({
        ...auth.useAuth(),
        logIn: mockedLogIn,
      });

      // ACT
      setup();
      const muniLogo = screen.getByAltText("MUNI logo");
      const muniLogInButton = screen.getByText("MUNI", { selector: "button" });

      // ASSERT
      expect(muniLogo).toBeInTheDocument();
      expect(muniLogInButton).toBeInTheDocument();

      await user.click(muniLogInButton);
      expect(mockedLogIn).toHaveBeenCalledOnce();
    });
  });
});
