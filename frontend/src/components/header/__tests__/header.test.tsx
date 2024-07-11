import ScienceIcon from "@mui/icons-material/Science";
import { operatorMRTest } from "@app/__tests__/data/operators";
import { RoutingPath } from "@app/routing-paths";
import type { OperatorDTO } from "@app/util/server_API/dto";
import { render, screen } from "@test-utils";
import { Header } from "../Header";
import type { TabProps } from "../navigation/tabs";

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
let mockOperator: OperatorDTO | undefined;

vi.mock("@app/hooks/auth/AuthProvider", () => ({
  useAuth: () => ({
    operator: mockOperator,
  }),
}));

//----------------------------------------------------------------------
// Mocking common header navigation functions
//----------------------------------------------------------------------
const tabs: TabProps[] = [
  {
    localizationKey: "1",
    urlPrefix: RoutingPath.WAITING_ROOM,
    onClick: () => ({}),
    Icon: ScienceIcon,
  },
  {
    localizationKey: "2",
    urlPrefix: RoutingPath.APPROVAL_ROOM,
    onClick: () => ({}),
    Icon: ScienceIcon,
  },
  {
    localizationKey: "3",
    urlPrefix: RoutingPath.RECENT_VISITS,
    onClick: () => ({}),
    Icon: ScienceIcon,
  },
];

vi.mock("@app/components/header/navigation/tabs", async () => ({
  getTabs: () => tabs,
  getCommonTabSx: () => ({}),
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("header", () => {
  const setup = () => {
    render(<Header />);
  };

  test("user is not logged in", () => {
    // ARRANGE
    mockOperator = undefined;

    // ACT
    setup();
    const ceitecMafilLogo = screen.getByAltText("CEITEC-MAFIL logo");
    const languageMenu = screen.getByTestId("language-menu");
    const headerTabs = screen.queryAllByRole("tab");

    // ASSERT
    expect(ceitecMafilLogo).toBeInTheDocument();
    expect(languageMenu).toBeInTheDocument();
    expect(headerTabs.length).toBe(0);
  });

  test("user is logged in", async () => {
    // ARRANGE
    mockOperator = operatorMRTest;

    // ACT
    setup();
    const ceitecMafilLogo = await screen.findByAltText("CEITEC-MAFIL logo");
    const languageMenu = screen.getByTestId("language-menu");
    const headerTabs = screen.getAllByRole("tab");

    // ASSERT
    expect(`${operatorMRTest.name} ${operatorMRTest.surname}`).toBeDefined();
    expect(ceitecMafilLogo).toBeInTheDocument();
    expect(languageMenu).toBeInTheDocument();
    expect(headerTabs.length).toBe(tabs.length);
  });
});
