import { operatorMRTest } from "@app/__tests__/data/operators";
import type { OperatorDTO } from "@app/util/server_API/dto";
import { render, screen } from "@test-utils";
import { FormProjectInfo } from "../FormProjectInfo";

//----------------------------------------------------------------------
// Mocking react-hook-form
//----------------------------------------------------------------------
vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
  useFormContext: () => ({
    getValues: vi.fn(),
    setValue: vi.fn(),
  }),
}));

//----------------------------------------------------------------------
// Mocking server API calls
//----------------------------------------------------------------------
vi.mock("@app/util/server_API/calls", async () => ({
  fetchOperator: async (): Promise<OperatorDTO> => operatorMRTest,
}));

//----------------------------------------------------------------------
// Mocking error components
//----------------------------------------------------------------------
vi.mock("@app/components/form/inputs/ErrorMessage", () => ({
  ErrorMessage: () => <div />,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("form project info", () => {
  const setup = () => render(<FormProjectInfo />);

  test("contains translations", () => {
    // ACT
    const { container } = setup();

    // ASSERT
    expect(container).toHaveTextContent(/form.projectInfo.title/);
    expect(container).toHaveTextContent(/form.projectInfo.project/);
    expect(container).toHaveTextContent(/form.projectInfo.device/);
    expect(container).toHaveTextContent(/form.projectInfo.measuredAt/);
  });

  test("has all input fields", () => {
    // ACT
    setup();
    const inputs = screen.getAllByTestId("input");

    // ASSERT
    expect(inputs.length).toEqual(3);
  });
});
