import { IOperator } from "../../../hooks/auth/interfaces";
import { render } from "../../../__tests__/utils";
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

vi.mock("../../../hooks/auth/auth", () => ({
  useAuth: () => ({
    operator: mockOperator,
  }),
}));

describe("operator-card", () => {
  test("shows operator fullname", () => {
    const { container } = render(<OperatorCard />);

    expect(container).toHaveTextContent(`${operatorName} ${operatorSurname}`);
  });
});
