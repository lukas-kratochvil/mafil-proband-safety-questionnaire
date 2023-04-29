import userEvent from "@testing-library/user-event";
import HomePage from "@app/pages/HomePage";
import { RoutingPath } from "@app/routing-paths";
import { render, screen } from "@test-utils";

//----------------------------------------------------------------------
// Mocking LanguageMenu due to undefined i18n instance that is used inside this component
//----------------------------------------------------------------------
vi.mock("@app/components/header/LanguageMenu", () => ({
  LanguageMenu: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking react-router-dom hooks
//----------------------------------------------------------------------
const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as Record<string, unknown>),
  useNavigate: () => mockedUseNavigate,
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
describe("home page", () => {
  test("contains translations", () => {
    const { container } = render(<HomePage />);

    expect(container).toHaveTextContent(/homePage.title/);
    const openNewFormButton = screen.getByRole("button", { name: "homePage.openNewFormButton" });
    expect(openNewFormButton).toBeInTheDocument();
  });

  test("clicks open new form button", async () => {
    render(<HomePage />);
    const user = userEvent.setup();

    const openNewForButton = screen.getByRole("button");
    await user.click(openNewForButton);

    expect(mockedUseNavigate).toHaveBeenCalledOnce();
    expect(mockedUseNavigate).toHaveBeenLastCalledWith(RoutingPath.PROBAND_FORM);
  });
});
