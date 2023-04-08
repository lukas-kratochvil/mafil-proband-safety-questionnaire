import i18n from "@app/i18n";
import { IQuestionDTO } from "@app/util/server_API/dto";
import { render } from "@test-utils";
import { FormQuestions } from "../FormQuestions";

vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
  useFormContext: () => ({
    setValue: vi.fn(),
  }),
  useWatch: vi.fn(),
}));

vi.mock("src/util/fetch", () => ({
  fetchQuestion: async (): Promise<IQuestionDTO> => ({
    id: "p1q01",
    partNumber: 1,
    mustBeApproved: false,
    translations: [
      {
        text: "Otázka1",
        language: {
          code: "cs",
        },
      },
      {
        text: "Question1",
        language: {
          code: "en",
        },
      },
    ],
    hiddenByGenders: [],
  }),
}));

describe("form questions", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translated title", async () => {
    const title = "title";

    const { container } = render(
      <FormQuestions
        titleLocalizationKey={title}
        qacs={[]}
      />
    );

    expect(container).toHaveTextContent(`form.safetyQuestions.${title}`);
  });
});
