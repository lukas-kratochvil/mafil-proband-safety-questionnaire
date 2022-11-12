import { render } from "@test-utils";
import i18n from "src/i18n";
import { FormExaminationConsent } from "../FormExaminationConsent";


describe("form examination consent", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("has title and text", async () => {
    const { container } = render(<FormExaminationConsent />);

    expect(container).toHaveTextContent(/^form.examinationConsent.title/);
    expect(container).toHaveTextContent(/form.examinationConsent.text1/);
    expect(container).toHaveTextContent(/form.examinationConsent.text2/);
    expect(container).toHaveTextContent(/form.examinationConsent.contactInfo/);
    expect(container).toHaveTextContent(/form.examinationConsent.address/);
    expect(container).toHaveTextContent(/form.examinationConsent.contactPerson: Michal Mikl/);
    expect(container).toHaveTextContent(/form.examinationConsent.phone: \+ 420 54949 6099/);
    expect(container).toHaveTextContent(/form.examinationConsent.email: mafil@ceitec.muni.cz$/);
  });
});
