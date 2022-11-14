import { render } from "@test-utils";
import i18n from "src/i18n";
import { IQuestionData } from "src/interfaces/question";
import { FormQuestions } from "../FormQuestions";

vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
  useFormContext: () => ({
    setValue: vi.fn(),
  }),
  useWatch: vi.fn(),
}));

vi.mock("src/util/fetch", () => ({
  fetchQuestion: async (questionId: string): Promise<IQuestionData> => ({
    id: "1",
    partNumber: 1,
    text: "Question text",
  }),
}));

describe("form project info", () => {
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
