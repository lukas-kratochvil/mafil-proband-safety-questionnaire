import HomePage from "@app/pages/HomePage";
import { RoutingPath } from "@app/routing-paths";
import { render, screen } from "@test/utils";

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
describe("home page", () => {
  const setup = () => {
    render(<HomePage />);
  };

  test("contains translations", () => {
    // ACT
    setup();

    // ASSERT
    expect(screen.getByText("homePage.title")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "homePage.openNewFormButton" })).toBeInTheDocument();
  });

  test("contains correct links", () => {
    // ACT
    setup();

    // ASSERT
    expect(screen.getByRole("link", { name: "homePage.openNewFormButton" })).toHaveAttribute(
      "href",
      RoutingPath.PROBAND_FORM
    );
  });
});
