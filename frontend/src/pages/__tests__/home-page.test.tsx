import userEvent from "@testing-library/user-event";
import i18n from "@app/i18n";
import HomePage from "@app/pages/HomePage";
import { RoutingPaths } from "@app/routing-paths";
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
// Tests
//----------------------------------------------------------------------
describe("home page", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

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
    expect(mockedUseNavigate).toHaveBeenLastCalledWith(RoutingPaths.PROBAND_FORM);
  });
});
