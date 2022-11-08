import userEvent from "@testing-library/user-event";
import { render, screen } from "@test-utils";
import i18n from "../../../i18n";
import { LogOutButton } from "../LogOutButton";

const logOutSpy = vi.fn();

vi.mock("../../../hooks/auth/auth", () => ({
  useAuth: () => ({
    logOut: logOutSpy,
  }),
}));

describe("logout-button", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("logOut button has title", async () => {
    render(<LogOutButton />);

    const logOutButton = screen.getByRole("button");

    expect(logOutButton).toHaveTextContent(/^common.logOutButton$/);
  });

  test("log out if logOut button is clicked", async () => {
    render(<LogOutButton />);

    const logOutButton = screen.getByRole("button");
    await userEvent.click(logOutButton);

    expect(logOutSpy).toHaveBeenCalledTimes(1);
  });
});
