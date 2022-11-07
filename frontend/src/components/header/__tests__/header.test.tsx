import { render, screen, within } from "../../../__tests__/utils";
import { Header } from "../Header";

//----------------------------------------------------------------------
// Mocking react-router-dom useLocation() and useNavigate() hooks
//----------------------------------------------------------------------
const mockUseLocation = vi.fn();
const mockUseNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
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
  test("auth user isn't logged in - contains CEITEC logo", () => {
    mockOperator = undefined;

    render(<Header />);

    expect(screen.getByAltText("CEITEC-MAFIL logo")).toBeInTheDocument();
  });

  test("auth user isn't logged in - contains language menu", () => {
    mockOperator = undefined;

    render(<Header />);

    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
  });

  test("auth user isn't logged in - contains no tabs", () => {
    mockOperator = undefined;

    const { container } = render(<Header />);
    const tabsInHeader = within(container).queryByTestId("navTab");

    expect(tabsInHeader).toBeNull();
  });

  // TODO: test which components should appear in the Header for auth user

  // TODO: correct the test
  // test("auth user is logged in - contains all tabs", () => {
  //   mockOperator = "Username";

  //   const { container } = render(<Header />);
  //   const tabsInHeader = within(container).getAllByTestId("navTab");

  //   expect(tabsInHeader.length).toBe(5);
  // });
});
