import i18n from "@i18n";
import { render, screen, waitFor } from "@test-utils";
import { FormProjectInfo } from "../FormProjectInfo";

vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
}));

vi.mock("@components/form/inputs/ErrorFeedback", () => ({
  ErrorFeedback: () => <div />,
}));

describe("form project info", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", async () => {
    const { container } = render(<FormProjectInfo />);

    await waitFor(async () => expect(container).toHaveTextContent(/form.projectInfo.title/));
    expect(container).toHaveTextContent(/form.projectInfo.project/);
    expect(container).toHaveTextContent(/form.projectInfo.device/);
    expect(container).toHaveTextContent(/form.projectInfo.measurementDate/);
  });

  test("has all input fields", async () => {
    render(<FormProjectInfo />);

    const inputs = screen.getAllByTestId("input");

    await waitFor(async () => expect(inputs.length).toEqual(3));
  });
});
