import { render } from "@test-utils";
import i18n from "src/i18n";
import { FormSafetyInfo } from "../FormSafetyInfo";


describe("form before examination", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("has title and text", async () => {
    const { container } = render(<FormSafetyInfo />);

    expect(container).toHaveTextContent(/^form.safetyInfo.title/);
    expect(container).toHaveTextContent(/form.safetyInfo.text$/);
  });
});
