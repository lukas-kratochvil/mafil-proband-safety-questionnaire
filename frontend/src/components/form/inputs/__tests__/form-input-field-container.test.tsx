import { render } from "@test-utils";
import i18n from "src/i18n";
import { FormInputFieldContainer } from "../FormInputFieldContainer";

vi.mock("../../ErrorFeedback", () => ({
  ErrorFeedback: () => <div />,
}));

describe("form input field container", () => {
  beforeEach(() => {
    i18n.changeLanguage("cimode");
  });

  test("required field contains only label", () => {
    const label = "Label";

    const { container } = render(
      <FormInputFieldContainer
        label={label}
        name=""
      />
    );

    expect(container).toHaveTextContent(new RegExp(`^${label}$`));
    expect(container).not.toHaveTextContent("(form.common.optional)");
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
