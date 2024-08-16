import ScienceIcon from "@mui/icons-material/Science";
import { RoutingPath } from "@app/routing-paths";
import type { OperatorDTO } from "@app/util/server_API/dto";
import { operatorMRTest } from "@test/data/operators";
import { render, screen } from "@test/utils";
import { Header } from "../Header";
import type { TabProps } from "../navigation/tabs";

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
let mockOperator: OperatorDTO | undefined;

vi.mock("@app/hooks/auth/auth", () => ({
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
    urlPath: RoutingPath.WAITING_ROOM,
    onClick: () => ({}),
    Icon: ScienceIcon,
  },
  {
    localizationKey: "2",
    urlPath: RoutingPath.APPROVAL_ROOM,
    onClick: () => ({}),
    Icon: ScienceIcon,
  },
  {
    localizationKey: "3",
    urlPath: RoutingPath.RECENT_VISITS,
    onClick: () => ({}),
    Icon: ScienceIcon,
  },
];

vi.mock("@app/components/header/navigation/tabs", async () => ({
  getTabs: () => tabs,
  getCommonTabSx: () => ({}),
  TAB_DEFAULT_COLOR: "orange",
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

    // ASSERT
    expect(screen.getByAltText("CEITEC-MAFIL logo")).toBeInTheDocument();
    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
    expect(screen.queryAllByRole("tab").length).toBe(0);
  });

  test("user is logged in", async () => {
    // ARRANGE
    mockOperator = operatorMRTest;

    // ACT
    setup();

    // ASSERT
    expect(`${operatorMRTest.name} ${operatorMRTest.surname}`).toBeDefined();
    expect(await screen.findByAltText("CEITEC-MAFIL logo")).toBeInTheDocument();
    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
    expect(screen.getAllByRole("tab").length).toBe(tabs.length);
  });
});
