import i18n from "@app/i18n";
import { render } from "@test-utils";
import { FormExaminationConsent } from "../FormExaminationConsent";

describe("form examination consent", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", () => {
    const { container } = render(<FormExaminationConsent />);

    expect(container).toHaveTextContent(/form.examinationConsent.title/);
    expect(container).toHaveTextContent(/form.examinationConsent.text1/);
    expect(container).toHaveTextContent(/form.examinationConsent.text2/);
    expect(container).toHaveTextContent(/form.examinationConsent.contactInfo/);
    expect(container).toHaveTextContent(/form.examinationConsent.address/);
    expect(container).toHaveTextContent(/form.examinationConsent.contactPerson/);
    expect(container).toHaveTextContent(/form.examinationConsent.phone/);
    expect(container).toHaveTextContent(/form.examinationConsent.email/);
  });
});
