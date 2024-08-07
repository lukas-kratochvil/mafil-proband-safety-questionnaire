import { render, screen } from "@app/tests/utils";
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
  const setup = () => render(<FormProbandContact />);

  test("contains translations", () => {
    // ACT
    const { container } = setup();

    // ASSERT
    expect(container).toHaveTextContent(/form.probandContact.title/);
    expect(container).toHaveTextContent(/form.probandContact.email/);
    expect(container).toHaveTextContent(/form.probandContact.phone/);
  });

  test("has all input fields", () => {
    // ACT
    setup();
    const inputs = screen.getAllByTestId(inputTestId);

    // ASSERT
    expect(inputs.length).toEqual(2);
  });
});
