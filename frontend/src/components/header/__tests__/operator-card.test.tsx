import { IOperator } from "@app/interfaces/auth";
import { render } from "@test-utils";
import { OperatorCard } from "../OperatorCard";

const operatorName = "Name";
const operatorSurname = "Surname";

const mockOperator: IOperator = {
  name: operatorName,
  surname: operatorSurname,
  email: "",
  hasHigherPermission: false,
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
