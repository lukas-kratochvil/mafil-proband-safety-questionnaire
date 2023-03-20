import { IOperatorDTO } from "@app/util/server_API/dto";
import { render } from "@test-utils";
import { OperatorCard } from "../OperatorCard";

const operatorName = "Name";
const operatorSurname = "Surname";

const mockOperator: IOperatorDTO = {
  id: "1",
  name: operatorName,
  surname: operatorSurname,
  email: "",
  role: "MR",
  uco: "",
};

vi.mock("@app/hooks/auth/auth", () => ({
  useAuth: () => ({
    operator: mockOperator,
  }),
}));

describe("operator card", () => {
  test("shows operator fullname", () => {
    const { container } = render(<OperatorCard />);

    expect(container).toHaveTextContent(`${operatorName} ${operatorSurname}`);
  });
});
