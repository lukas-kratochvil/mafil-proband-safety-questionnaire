import { render } from "@test-utils";
import i18n from "src/i18n";
import { FormBeforeExamination } from "../FormBeforeExamination";

describe("form before examination", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", async () => {
    const { container } = render(<FormBeforeExamination />);

    expect(container).toHaveTextContent(/form.beforeExamination.title/);
    expect(container).toHaveTextContent(/form.beforeExamination.text/);
  });
});
