import { render, screen } from "@test/utils";
import { FormProbandContact } from "../FormProbandContact";

//----------------------------------------------------------------------
// Mocking react-hook-form
//----------------------------------------------------------------------
const inputTestId = "input";
vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid={inputTestId} />,
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
describe("form proband contact", () => {
  const setup = () => {
    render(<FormProbandContact />);
  };

  test("contains translations", () => {
    // ACT
    setup();

    // ASSERT
    expect(screen.getByText("form.probandContact.title")).toBeInTheDocument();
    expect(screen.getByText("form.probandContact.email")).toBeInTheDocument();
    expect(screen.getByText("form.probandContact.phone")).toBeInTheDocument();
  });

  test("has all input fields", () => {
    // ACT
    setup();
    const inputs = screen.getAllByTestId(inputTestId);

    // ASSERT
    expect(inputs.length).toEqual(2);
  });
});
