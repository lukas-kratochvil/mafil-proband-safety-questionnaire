import { render, screen } from "@test-utils";
import userEvent from "@testing-library/user-event";
import { UrlBasePaths } from "src/App";
import i18n from "src/i18n";
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
    expect(mockedUseNavigate).toHaveBeenLastCalledWith(UrlBasePaths.PROBAND_FORM);
  });
});
