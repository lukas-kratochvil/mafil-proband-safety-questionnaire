import ScienceIcon from "@mui/icons-material/Science";
import { operatorMRDev } from "@app/__tests__/data/operators";
import { RoutingPaths } from "@app/routing-paths";
import { IOperatorDTO } from "@app/util/server_API/dto";
import { render, screen, within } from "@test-utils";
import { Header } from "../Header";
import { ITabProps } from "../navigation/common";

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
let mockOperator: IOperatorDTO | undefined;

vi.mock("@app/hooks/auth/AuthProvider", () => ({
  useAuth: () => ({
    operator: mockOperator,
  }),
}));

//----------------------------------------------------------------------
// Mocking common header navigation functions
//----------------------------------------------------------------------
const tabs: ITabProps[] = [
  {
    localizationKey: "1",
    urlPrefix: RoutingPaths.WAITING_ROOM,
    onClick: () => ({}),
    Icon: ScienceIcon,
  },
  {
    localizationKey: "2",
    urlPrefix: RoutingPaths.APPROVAL_ROOM,
    onClick: () => ({}),
    Icon: ScienceIcon,
  },
  {
    localizationKey: "3",
    urlPrefix: RoutingPaths.RECENT_VISITS,
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
      mockOperator = operatorMRDev;

      const { container } = render(<Header />);
      const headerTabs = within(container).getAllByRole("tab");

      expect(headerTabs.length).toBe(tabs.length);
    });
  });
});
