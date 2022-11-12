import { render } from "@test-utils";
import i18n from "src/i18n";
import { FormEntryInfo } from "../FormEntryInfo";

describe("form entry info", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("has title and text", async () => {
    const { container } = render(<FormEntryInfo />);

    expect(container).toHaveTextContent(/^form.entryInfo.title/);
    expect(container).toHaveTextContent(/form.entryInfo.text1/);
    expect(container).toHaveTextContent(/form.entryInfo.text2$/);
  });
});
