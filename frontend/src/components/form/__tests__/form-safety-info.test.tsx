import i18n from "@i18n";
import { render } from "@test-utils";
import { FormSafetyInfo } from "../components/FormSafetyInfo";

describe("form before examination", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", () => {
    const { container } = render(<FormSafetyInfo />);

    expect(container).toHaveTextContent(/form.safetyInfo.title/);
    expect(container).toHaveTextContent(/form.safetyInfo.text/);
  });
});
