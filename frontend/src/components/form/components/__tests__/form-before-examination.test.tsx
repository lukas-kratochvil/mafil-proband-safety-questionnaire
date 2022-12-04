import i18n from "@i18n";
import { render } from "@test-utils";
import { FormBeforeExamination } from "../FormBeforeExamination";

describe("form before examination", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", () => {
    const { container } = render(<FormBeforeExamination />);

    expect(container).toHaveTextContent(/form.beforeExamination.title/);
    expect(container).toHaveTextContent(/form.beforeExamination.text/);
  });
});
