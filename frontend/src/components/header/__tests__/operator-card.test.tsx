import type { OperatorDTO } from "@app/util/server_API/dto";
import { render, screen } from "@test-utils";
import { OperatorCard } from "../OperatorCard";

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
const operator: OperatorDTO = {
  id: "1",
  name: "Name",
  surname: "Surname",
  email: "",
  role: "MR",
  username: "",
};

vi.mock("@app/hooks/auth/AuthProvider", () => ({
  useAuth: () => ({
    operator,
  }),
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("operator card", () => {
  const setup = () => {
    render(<OperatorCard />);
  };

  test("shows operator fullname", () => {
    // ACT
    setup();
    const operatorFullnameElem = screen.getByText(`${operator.name} ${operator.surname}`);

    // ASSERT
    expect(operatorFullnameElem).toBeInTheDocument();
  });
});
