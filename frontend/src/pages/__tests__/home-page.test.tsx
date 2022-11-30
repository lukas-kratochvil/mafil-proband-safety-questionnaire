import userEvent from "@testing-library/user-event";
import i18n from "@i18n";
import { RoutingPaths } from "@routing-paths";
import { render, screen } from "@test-utils";
import { HomePage } from "../HomePage";

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
    const openNewForButton = screen.getByRole("button");

    expect(container).toHaveTextContent(/homePage.title/);
    expect(openNewForButton).toHaveTextContent(/homePage.openNewFormButton/);
  });

  test("clicks open new form button", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const openNewForButton = screen.getByRole("button");
    await user.click(openNewForButton);

    expect(mockedUseNavigate).toHaveBeenCalledOnce();
    expect(mockedUseNavigate).toHaveBeenLastCalledWith(RoutingPaths.PROBAND_FORM);
  });
});
