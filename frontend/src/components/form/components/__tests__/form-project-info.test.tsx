import { operatorMRTest } from "@app/__tests__/data/operators";
import { IOperatorDTO } from "@app/util/server_API/dto";
import { render, screen, waitFor } from "@test-utils";
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
  fetchOperator: async (): Promise<IOperatorDTO> => operatorMRTest,
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
  test("contains translations", async () => {
    const { container } = render(<FormProjectInfo />);

    await waitFor(async () => expect(container).toHaveTextContent(/form.projectInfo.title/));
    expect(container).toHaveTextContent(/form.projectInfo.project/);
    expect(container).toHaveTextContent(/form.projectInfo.device/);
    expect(container).toHaveTextContent(/form.projectInfo.measuredAt/);
  });

  test("has all input fields", async () => {
    render(<FormProjectInfo />);

    const inputs = screen.getAllByTestId("input");

    await waitFor(async () => expect(inputs.length).toEqual(3));
  });
});
