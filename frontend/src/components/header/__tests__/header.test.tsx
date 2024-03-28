import ScienceIcon from "@mui/icons-material/Science";
import { operatorMRTest } from "@app/__tests__/data/operators";
import { RoutingPath } from "@app/routing-paths";
import type { OperatorDTO } from "@app/util/server_API/dto";
import { render, screen, within } from "@test-utils";
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

vi.mock("@app/components/header/navigation/common", async () => ({
  getTabs: () => tabs,
  getCommonTabSx: () => ({}),
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
      const headerTabs = within(container).queryAllByRole("tab");

      expect(headerTabs.length).toBe(0);
    });
  });

  describe("auth user is logged in", () => {
    test("contains all tabs", () => {
      mockOperator = operatorMRTest;

      const { container } = render(<Header />);
      const headerTabs = within(container).getAllByRole("tab");

      expect(headerTabs.length).toBe(tabs.length);
    });
  });
});
