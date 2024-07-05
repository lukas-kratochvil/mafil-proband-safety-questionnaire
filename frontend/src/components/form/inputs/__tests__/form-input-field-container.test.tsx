import { render } from "@test-utils";
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
  test("required field contains only label", () => {
    // Arrange
    const label = "Label";

    // Act
    const { container } = render(
      <FormInputFieldContainer
        label={label}
        name=""
      />
    );

    // Assert
    expect(container).toHaveTextContent(label);
  });

  test("optional field contains label with 'optional' text", () => {
    // Arrange
    const label = "Label";

    // Act
    const { container } = render(
      <FormInputFieldContainer
        label={label}
        name=""
        isOptional
      />
    );

    // Assert
    expect(container).toHaveTextContent(label);
    expect(container).toHaveTextContent(/\(form.common.optional\)$/);
  });
});
