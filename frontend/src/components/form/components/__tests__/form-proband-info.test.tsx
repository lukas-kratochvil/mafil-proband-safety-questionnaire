import { render, screen } from "@test-utils";
import { FormProbandInfo } from "../FormProbandInfo";

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
vi.mock("@app/hooks/auth/AuthProvider", () => ({
  useAuth: () => ({
    operator: undefined,
  }),
}));

//----------------------------------------------------------------------
// Mocking react
//----------------------------------------------------------------------
vi.mock("react", () => ({
  useEffect: vi.fn(),
}));

//----------------------------------------------------------------------
// Mocking react-hook-form
//----------------------------------------------------------------------
vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid="input" />,
  useFormContext: () => ({
    getFieldState: vi.fn(),
    resetField: vi.fn(),
    setValue: vi.fn(),
  }),
  useWatch: vi.fn(),
}));

//----------------------------------------------------------------------
// Mocking error components
//----------------------------------------------------------------------
vi.mock("@app/components/form/inputs/ErrorMessage", () => ({
  ErrorMessage: () => <div />,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("form proband info", () => {
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
    expect(container).toHaveTextContent(/form.probandInfo.visualCorrectionDioptre/);
    expect(container).toHaveTextContent(/form.probandInfo.handedness/);
  });

  test("has all input fields", () => {
    render(<FormProbandInfo />);

    const inputs = screen.getAllByTestId("input");

    expect(inputs.length).toEqual(11);
  });
});
