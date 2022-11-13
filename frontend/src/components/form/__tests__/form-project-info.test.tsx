import { act, render, screen } from "@test-utils";
import i18n from "src/i18n";
import { FormProjectInfo } from "../FormProjectInfo";

vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
}));

vi.mock("../ErrorFeedback", () => ({
  ErrorFeedback: () => <div />,
}));

describe("form project info", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", async () => {
    await act(async () => {
      render(<FormProjectInfo />);
    });

    expect(screen.getByText("form.projectInfo.title")).toBeInTheDocument();
    expect(screen.getByText("form.projectInfo.project")).toBeInTheDocument();
    expect(screen.getByText("form.projectInfo.device")).toBeInTheDocument();
    expect(screen.getByText("form.projectInfo.measurementDate")).toBeInTheDocument();
  });

  test("has all input fields", async () => {
    await act(async () => {
      render(<FormProjectInfo />);
    });

    const inputs = screen.getAllByTestId("input");

    expect(inputs.length).toEqual(3);
  });
});
