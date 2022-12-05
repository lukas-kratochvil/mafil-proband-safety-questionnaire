import i18n from "@i18n";
import { IQuestionData } from "@interfaces/question";
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
  fetchQuestion: async (): Promise<IQuestionData> => ({
    id: "1",
    partNumber: 1,
    text: "Question text",
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
