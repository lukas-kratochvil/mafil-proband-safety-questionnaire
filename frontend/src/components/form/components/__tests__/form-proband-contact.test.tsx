import i18n from "@i18n";
import { render, screen } from "@test-utils";
import { FormProbandContact } from "../FormProbandContact";

vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
}));

vi.mock("@components/form/inputs/ErrorFeedback", () => ({
  ErrorFeedback: () => <div />,
}));

describe("form proband contact", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

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
