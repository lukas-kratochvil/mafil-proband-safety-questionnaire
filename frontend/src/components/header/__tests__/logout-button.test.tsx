import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@app/tests/utils";
import { LogOutButton } from "../LogOutButton";

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
const logOutSpy = vi.fn();

vi.mock("@app/hooks/auth/auth", () => ({
  useAuth: () => ({
    logOut: logOutSpy,
  }),
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("logout button", () => {
  const setup = () => {
    render(<LogOutButton />);
  };

  test("has title", () => {
    // ACT
    setup();
    const logOutButton = screen.getByRole("button");

    // ASSERT
    expect(logOutButton).toHaveTextContent(/^common.logOutButton$/);
  });

  test("log out if is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    setup();
    const logOutButton = screen.getByRole("button");
    await user.click(logOutButton);

    // ASSERT
    expect(logOutSpy).toHaveBeenCalledOnce();
  });
});
