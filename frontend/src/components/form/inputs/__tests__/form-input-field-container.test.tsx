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
    const label = "Label";

    const { container } = render(
      <FormInputFieldContainer
        label={label}
        name=""
      />
    );

    expect(container).toHaveTextContent(new RegExp(`^${label}$`));
  });

  test("optional field contains label with 'optional' text", () => {
    const label = "Label";

    const { container } = render(
      <FormInputFieldContainer
        label={label}
        name=""
        isOptional
      />
    );

    expect(container).toHaveTextContent(new RegExp(`^${label}`));
    expect(container).toHaveTextContent(/\(form.common.optional\)$/);
  });
});
