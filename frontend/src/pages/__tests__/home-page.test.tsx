import userEvent from "@testing-library/user-event";
import i18n from "@i18n";
import HomePage from "@pages/HomePage";
import { RoutingPaths } from "@routing-paths";
import { render, screen } from "@test-utils";

const mockedUseNavigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as Record<string, unknown>),
  useNavigate: () => mockedUseNavigate,
}));

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
