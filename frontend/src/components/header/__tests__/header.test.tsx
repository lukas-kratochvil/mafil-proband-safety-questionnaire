import { render, screen, within } from "@test-utils";
import { Header } from "../Header";

//----------------------------------------------------------------------
// Mocking react-router-dom useLocation() and useNavigate() hooks
//----------------------------------------------------------------------
const mockUseLocation = vi.fn();
const mockUseNavigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as Record<string, unknown>),
  useLocation: () => mockUseLocation,
  useNavigate: () => mockUseNavigate,
}));

//----------------------------------------------------------------------
// Mocking custom useAuth() hook
//----------------------------------------------------------------------
let mockOperator: string | undefined;

vi.mock("../../../hooks/auth/auth", () => ({
  useAuth: () => ({
    operator: mockOperator,
  }),
}));

//----------------------------------------------------------------------
// Mocking custom getTabs() and isTabSelected() function
//----------------------------------------------------------------------
const mockIsTabSelected = vi.fn();
const mockGetTabs = vi.fn().mockImplementation(() => [
  {
    localizationKey: "waitingRoom",
    urlPrefix: "",
    onClick: () => ({}),
    Icon: undefined,
    showCount: true,
  },
]);

vi.mock("../navigation/common", () => ({
  isTabSelected: () => mockIsTabSelected,
  getTabs: () => mockGetTabs,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("header", () => {
  describe("auth user isn't logged in", () => {
    test("contains CEITEC logo", () => {
      mockOperator = undefined;

      render(<Header />);

      expect(screen.getByAltText("CEITEC-MAFIL logo")).toBeInTheDocument();
    });

    test("contains language menu", () => {
      mockOperator = undefined;

      render(<Header />);

      expect(screen.getByTestId("language-menu")).toBeInTheDocument();
    });

    test("contains no tabs", () => {
      mockOperator = undefined;

      const { container } = render(<Header />);
      const tabsInHeader = within(container).queryByTestId("navTab");

      expect(tabsInHeader).toBeNull();
    });
  });

  describe.todo("auth user is logged in");

  // TODO: correct the test
  // test("auth user is logged in - contains all tabs", () => {
  //   mockOperator = "Username";

  //   const { container } = render(<Header />);
  //   const tabsInHeader = within(container).getAllByTestId("navTab");

  //   expect(tabsInHeader.length).toBe(5);
  // });
});
