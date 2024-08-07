import { render } from "@app/tests/utils";
import { FormQuestions } from "../FormQuestions";

//----------------------------------------------------------------------
// Mocking react-hook-form
//----------------------------------------------------------------------
vi.mock("react-hook-form", () => ({
  Controller: () => <div />,
  useFormContext: () => ({
    setValue: vi.fn(),
  }),
  useWatch: vi.fn(),
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("form questions", () => {
  const title = "title";

  const setup = () =>
    render(
      <FormQuestions
        titleLocalizationKey={title}
        qacs={[]}
      />
    );

  test("contains translated title", async () => {
    // ACT
    const { container } = setup();

    // ASSERT
    expect(container).toHaveTextContent(`form.safetyQuestions.${title}`);
  });
});
