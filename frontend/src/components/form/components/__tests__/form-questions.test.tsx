import type { FormQac } from "@app/model/form";
import { render, screen } from "@app/tests/utils";
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
  const setup = (title: string, qacs: FormQac[]) => {
    render(
      <FormQuestions
        titleLocalizationKey={title}
        qacs={qacs}
      />
    );
  };

  test("contains translated title", async () => {
    const title = "title";

    // ACT
    setup(title, []);

    // ASSERT
    expect(screen.getByText(`form.safetyQuestions.${title}`)).toBeInTheDocument();
  });
});
