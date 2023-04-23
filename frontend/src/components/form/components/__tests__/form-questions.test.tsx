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
    updatedAt: new Date(),
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
