import type { NativeLanguage } from "@app/model/language";
import type { GenderDTO, HandednessDTO } from "@app/util/server_API/dto";
import { gendersTest } from "@test/data/genders";
import { handednessesTest } from "@test/data/handednesses";
import { nativeLanguagesTest } from "@test/data/languages";
import { render, screen } from "@test/utils";
import { FormProbandInfo } from "../FormProbandInfo";

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
vi.mock("@app/hooks/auth/auth", () => ({
  useAuth: () => ({
    operator: undefined,
  }),
}));

//----------------------------------------------------------------------
// Mocking server API calls
//----------------------------------------------------------------------
vi.mock("@app/util/server_API/calls", async () => ({
  fetchGenders: async (): Promise<GenderDTO[]> => gendersTest,
  fetchHandednesses: async (): Promise<HandednessDTO[]> => handednessesTest,
}));

//----------------------------------------------------------------------
// Mocking MAFILDB API calls
//----------------------------------------------------------------------
vi.mock("@app/util/mafildb_API/calls", async () => ({
  fetchNativeLanguages: async (): Promise<NativeLanguage[]> => nativeLanguagesTest,
}));

//----------------------------------------------------------------------
// Mocking react
//----------------------------------------------------------------------
vi.mock("react", async () => ({
  ...(await vi.importActual("react")),
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
  const setup = () => {
    render(<FormProbandInfo />);
  };

  test("contains translations", () => {
    // ACT
    setup();

    // ASSERT
    expect(screen.getByText("form.probandInfo.title")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.name")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.surname")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.personalId")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.birthdate")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.gender")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.nativeLanguage")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.height")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.weight")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.visualCorrection")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.visualCorrectionDioptre")).toBeInTheDocument();
    expect(screen.getByText("form.probandInfo.handedness")).toBeInTheDocument();
  });

  test("has all input fields", () => {
    // ACT
    setup();
    const inputs = screen.getAllByTestId(inputTestId);

    // ASSERT
    expect(inputs.length).toEqual(11);
  });
});
