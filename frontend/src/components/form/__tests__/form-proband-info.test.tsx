import i18n from "@i18n";
import { render, screen } from "@test-utils";
import { FormProbandInfo } from "../components/FormProbandInfo";

vi.mock("react", () => ({
  useEffect: vi.fn(),
}));

vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
  useFormContext: () => ({
    getFieldState: vi.fn(),
    resetField: vi.fn(),
    setValue: vi.fn(),
  }),
  useWatch: vi.fn(),
}));

vi.mock("../ErrorFeedback", () => ({
  ErrorFeedback: () => <div />,
}));

describe("form proband info", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", () => {
    const { container } = render(<FormProbandInfo />);

    expect(container).toHaveTextContent(/form.probandInfo.title/);
    expect(container).toHaveTextContent(/form.probandInfo.name/);
    expect(container).toHaveTextContent(/form.probandInfo.surname/);
    expect(container).toHaveTextContent(/form.probandInfo.personalId/);
    expect(container).toHaveTextContent(/form.probandInfo.birthdate/);
    expect(container).toHaveTextContent(/form.probandInfo.gender/);
    expect(container).toHaveTextContent(/form.probandInfo.nativeLanguage/);
    expect(container).toHaveTextContent(/form.probandInfo.height/);
    expect(container).toHaveTextContent(/form.probandInfo.weight/);
    expect(container).toHaveTextContent(/form.probandInfo.visualCorrection/);
    expect(container).toHaveTextContent(/form.probandInfo.visualCorrectionValue/);
    expect(container).toHaveTextContent(/form.probandInfo.sideDominance/);
  });

  test("has all input fields", () => {
    render(<FormProbandInfo />);

    const inputs = screen.getAllByTestId("input");

    expect(inputs.length).toEqual(11);
  });
});
