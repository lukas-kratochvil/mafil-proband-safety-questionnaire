import { render, screen } from "@test-utils";
import { FormProbandContact } from "../FormProbandContact";

//----------------------------------------------------------------------
// Mocking react-hook-form
//----------------------------------------------------------------------
vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
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
  test("contains translations", () => {
    const { container } = render(<FormProbandContact />);

    expect(container).toHaveTextContent(/form.probandContact.title/);
    expect(container).toHaveTextContent(/form.probandContact.email/);
    expect(container).toHaveTextContent(/form.probandContact.phone/);
  });

  test("has all input fields", () => {
    render(<FormProbandContact />);

    const inputs = screen.getAllByTestId("input");

    expect(inputs.length).toEqual(2);
  });
});
