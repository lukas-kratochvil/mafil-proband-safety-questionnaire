import { render } from "@test-utils";
import { FormQuestions } from "../FormQuestions";

//----------------------------------------------------------------------
// Mocking react-hook-form
//----------------------------------------------------------------------
vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
  useFormContext: () => ({
    setValue: vi.fn(),
  }),
  useWatch: vi.fn(),
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
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
