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
vi.mock("react", async () => ({
  ...(await import("react")),
  useEffect: () => vi.fn(),
}));

//----------------------------------------------------------------------
// Mocking react-hook-form
//----------------------------------------------------------------------
const inputTestId = "input";
vi.mock("react-hook-form", () => ({
  Controller: () => <div data-testid={inputTestId} />,
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
  const setup = () => render(<FormProbandInfo />);

  test("contains translations", () => {
    // ACT
    const { container } = setup();

    // ASSERT
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
    // ACT
    setup();
    const inputs = screen.getAllByTestId(inputTestId);

    // ASSERT
    expect(inputs.length).toEqual(11);
  });
});
