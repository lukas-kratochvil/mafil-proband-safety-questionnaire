import userEvent from "@testing-library/user-event";
import i18n from "@i18n";
import { render, screen } from "@test-utils";
import { LogOutButton } from "../LogOutButton";

const logOutSpy = vi.fn();

vi.mock("@hooks/auth/auth", () => ({
  useAuth: () => ({
    logOut: logOutSpy,
  }),
}));

describe("logout button", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("has title", () => {
    render(<LogOutButton />);

    const logOutButton = screen.getByRole("button");

    expect(logOutButton).toHaveTextContent(/^common.logOutButton$/);
  });

  test("log out if is clicked", async () => {
    const user = userEvent.setup();
    render(<LogOutButton />);

    const logOutButton = screen.getByRole("button");
    await user.click(logOutButton);

    expect(logOutSpy).toHaveBeenCalledTimes(1);
  });
});
