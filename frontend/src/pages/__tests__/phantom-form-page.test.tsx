import { userEvent } from "@testing-library/user-event";
import { format } from "date-fns";
import { devicesTest } from "@app/tests/data/devices";
import { gendersTest } from "@app/tests/data/genders";
import { handednessesTest } from "@app/tests/data/handednesses";
import { nativeLanguagesTest } from "@app/tests/data/languages";
import { operatorMRTest } from "@app/tests/data/operators";
import { pdfTest } from "@app/tests/data/pdf";
import { projectsTest } from "@app/tests/data/projects";
import { getPersonalIdPart } from "@app/components/form/util/personal-id";
import type { Device } from "@app/model/device";
import type { NativeLanguage } from "@app/model/language";
import type { Project } from "@app/model/project";
import PhantomFormPage from "@app/pages/PhantomFormPage";
import { RoutingPath } from "@app/routing-paths";
import * as mafildbCalls from "@app/util/mafildb_API/calls";
import * as serverCalls from "@app/util/server_API/calls";
import type { GenderDTO, HandednessDTO, PdfDTO } from "@app/util/server_API/dto";
import { render, screen } from "@app/tests/utils";

//----------------------------------------------------------------------
// Mocking react-router-dom hooks
//----------------------------------------------------------------------
const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as Record<string, unknown>),
  useNavigate: () => mockedUseNavigate,
}));

//----------------------------------------------------------------------
// Mocking custom ErrorMessage component
//----------------------------------------------------------------------
vi.mock("@app/components/form/inputs/ErrorMessage", () => ({
  ErrorMessage: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
vi.mock("@app/hooks/auth/auth", () => ({
  useAuth: () => ({
    operator: operatorMRTest,
  }),
}));

//----------------------------------------------------------------------
// Mocking server API calls
//----------------------------------------------------------------------
vi.mock("@app/util/server_API/calls", async () => ({
  fetchGenders: async (): Promise<GenderDTO[]> => gendersTest,
  fetchHandednesses: async (): Promise<HandednessDTO[]> => handednessesTest,
  generatePhantomPdf: async (): Promise<PdfDTO> => pdfTest,
}));

//----------------------------------------------------------------------
// Mocking MAFILDB API calls
//----------------------------------------------------------------------
vi.mock("@app/util/mafildb_API/calls", async () => ({
  ...(await import("@app/util/mafildb_API/calls")),
  fetchNativeLanguages: async (): Promise<NativeLanguage[]> => nativeLanguagesTest,
  fetchProjects: async (): Promise<Project[]> => projectsTest,
  fetchDevices: async (): Promise<Device[]> => devicesTest,
  addPdfToVisit: async (): Promise<string> => "fileId",
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("phantom form page", () => {
  const setup = () => {
    render(<PhantomFormPage />);
  };

  const visitUuid = "visitUuid";
  const createPhantomVisitSpy = vi
    .spyOn(mafildbCalls, "createPhantomVisit")
    .mockReturnValue(Promise.resolve({ visitId: "visitId", uuid: visitUuid }));
  const generatePhantomPdfSpy = vi.spyOn(serverCalls, "generatePhantomPdf");
  const addPdfToVisitSpy = vi.spyOn(mafildbCalls, "addPdfToVisit");

  afterEach(() => {
    createPhantomVisitSpy.mockClear();
    generatePhantomPdfSpy.mockClear();
    addPdfToVisitSpy.mockClear();
  });

  // Data
  const genderOther = gendersTest[2]?.translations[0]?.text;
  const nativeLanguageOther = nativeLanguagesTest[3]?.nativeName;
  const handednessUndetermined = handednessesTest[3]?.translations[0]?.text;
  const project1Text = `${projectsTest[0]?.acronym} - ${projectsTest[0]?.name}`;
  const device1Name = devicesTest[0]?.name;

  test("contains correct form buttons", async () => {
    // ARRANGE
    const buttonNames: string[] = ["form.common.buttons.finalize", "form.common.buttons.cancel"];

    // ACT
    setup();
    const buttons = await screen.findAllByRole("button", { name: /^form\.common\.buttons/ });

    // ASSERT
    expect(buttons.length).toBe(buttonNames.length);
    buttonNames.forEach(async (buttonName, index) => expect(buttons[index]?.textContent).toBe(buttonName));
  });

  test("renders new form default values", async () => {
    // ARRANGE
    vi.useFakeTimers();
    const currentDate = new Date();
    vi.setSystemTime(currentDate);

    // ACT
    setup();
    vi.useRealTimers();
    const form = await screen.findByRole("form");

    // ASSERT
    expect(form).toHaveFormValues({
      project: "",
      device: "",
      measuredAt: format(currentDate, "dd.MM.yyyy"),
      name: "",
      surname: "",
      personalId: "",
      birthdate: format(currentDate, "dd.MM.yyyy"),
      gender: "", // is set to 'Other' in the FormProbandInfo component
      nativeLanguage: "",
      heightCm: "",
      weightKg: "",
      handedness: "",
      visualCorrection: "form.options.visualCorrection.no",
      visualCorrectionDioptre: "0",
    });
  });

  test("when valid personal ID value is filled, birthdate and gender stays the same", async () => {
    // ARRANGE
    vi.useFakeTimers();
    const currentDate = new Date();
    vi.setSystemTime(currentDate);
    const user = userEvent.setup();

    // ACT
    setup();
    vi.useRealTimers();
    await user.type(await screen.findByLabelText("personalId"), "9606301232");

    // ASSERT
    expect(screen.getByLabelText("birthdate")).toHaveValue(format(currentDate, "dd.MM.yyyy"));
    expect(screen.getByLabelText("gender")).toHaveValue(genderOther);
  });

  test("submits form", async () => {
    // ARRANGE
    const user = userEvent.setup();
    vi.useFakeTimers();
    const currentDate = new Date();
    vi.setSystemTime(currentDate);

    // ACT
    setup();
    vi.useRealTimers();

    await user.click(screen.getByRole("combobox", { name: "project" }));
    const selectedProject = project1Text;
    await user.click(screen.getByRole("option", { name: selectedProject }));

    await user.click(screen.getByRole("combobox", { name: "device" }));
    const selectedDevice = device1Name;
    await user.click(screen.getByRole("option", { name: selectedDevice }));

    const typedName = "John";
    await user.type(screen.getByLabelText("name"), typedName);

    const typedSurname = "Wick";
    await user.type(screen.getByLabelText("surname"), typedSurname);

    const typedHeight = "173";
    await user.type(screen.getByLabelText("heightCm"), typedHeight);

    const typedWeight = "70";
    await user.type(screen.getByLabelText("weightKg"), typedWeight);

    // get form data
    const form = screen.getByRole("form");
    const finalizeButton = screen.getByRole("button", { name: "form.common.buttons.finalize" });

    // ASSERT
    const expectedFormValues = {
      project: selectedProject,
      device: selectedDevice,
      measuredAt: format(currentDate, "dd.MM.yyyy"),
      name: typedName,
      surname: typedSurname,
      personalId: getPersonalIdPart(currentDate, gendersTest[2]!),
      birthdate: format(currentDate, "dd.MM.yyyy"),
      gender: genderOther,
      nativeLanguage: nativeLanguageOther,
      heightCm: typedHeight,
      weightKg: typedWeight,
      handedness: handednessUndetermined,
      visualCorrection: "form.options.visualCorrection.no",
      visualCorrectionDioptre: "0",
    };
    expect(form).toHaveFormValues(expectedFormValues);

    await user.click(finalizeButton);
    expect(createPhantomVisitSpy).toHaveBeenCalledOnce();
    expect(generatePhantomPdfSpy).toHaveBeenCalledOnce();
    expect(addPdfToVisitSpy).toHaveBeenCalledWith(visitUuid, pdfTest);
    expect(mockedUseNavigate).toHaveBeenCalledWith(`${RoutingPath.RECENT_VISITS_VISIT}/${visitUuid}`);
  });
});
