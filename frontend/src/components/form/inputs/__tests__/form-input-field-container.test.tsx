import { render, screen } from "@test/utils";
import { FormInputFieldContainer } from "../FormInputFieldContainer";

//----------------------------------------------------------------------
// Mocking error components
//----------------------------------------------------------------------
vi.mock("@app/components/form/inputs/ErrorMessage", () => ({
  ErrorMessage: () => <div />,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("form input field container", () => {
  const setup = (label: string, isOptional?: boolean) => {
    render(
      <FormInputFieldContainer
        label={label}
        name=""
        isOptional={isOptional}
      />
    );
  };

  test("required field contains only label", () => {
    // Arrange
    const label = "Label";

    // Act
    setup(label);

    // Assert
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  test("optional field contains label with 'optional' text", () => {
    // Arrange
    const label = "Label";

    // Act
    setup(label, true);

    // Assert
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText("(form.common.optional)")).toBeInTheDocument();
  });
});
