import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { getProjectText } from "@app/components/form/util/utils";
import { devicesDev, projectsDev } from "@app/data/form_data";
import { genders, handednesses, nativeLanguages } from "@app/data/translated_entities_data";
import i18n from "@app/i18n";
import PhantomFormPage from "@app/pages/PhantomFormPage";
import { IDeviceDTO, IProjectDTO } from "@app/util/mafildb_API/dto";
import { IGenderDTO, IHandednessDTO, INativeLanguageDTO, IQuestionDTO } from "@app/util/server_API/dto";
import { render, screen, waitFor } from "@test-utils";

//----------------------------------------------------------------------
// Default data
//----------------------------------------------------------------------
const questionData: IQuestionDTO[] = [
  {
    id: "p1q01",
    partNumber: 1,
    mustBeApproved: false,
    translations: [
      {
        text: "Otázka1",
        language: {
          code: "cs",
        },
      },
      {
        text: "Question1",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "p1q02",
    partNumber: 1,
    mustBeApproved: false,
    translations: [
      {
        text: "Otázka2",
        language: {
          code: "cs",
        },
      },
      {
        text: "Question2",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "p2q01",
    partNumber: 2,
    mustBeApproved: true,
    translations: [
      {
        text: "Otázka3",
        language: {
          code: "cs",
        },
      },
      {
        text: "Question3",
        language: {
          code: "en",
        },
      },
    ],
  },
  {
    id: "p2q02",
    partNumber: 2,
    mustBeApproved: true,
    translations: [
      {
        text: "Otázka4",
        language: {
          code: "cs",
        },
      },
      {
        text: "Question4",
        language: {
          code: "en",
        },
      },
    ],
  },
];

//----------------------------------------------------------------------
// Mocking react-router-dom hooks
//----------------------------------------------------------------------
const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as Record<string, unknown>),
  useNavigate: () => mockedUseNavigate,
}));

//----------------------------------------------------------------------
// Mocking LanguageMenu due to undefined i18n instance that is used inside this component
//----------------------------------------------------------------------
vi.mock("@app/components/header/LanguageMenu", () => ({
  LanguageMenu: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking custom ErrorMessage component
//----------------------------------------------------------------------
vi.mock("@app/components/form/inputs/ErrorMessage", () => ({
  ErrorMessage: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking custom fetch methods
//----------------------------------------------------------------------
vi.mock("@app/util/server_API/fetch", async () => ({
  ...((await vi.importActual("@app/util/server_API/fetch")) as Record<string, unknown>),
  fetchGenders: async (): Promise<IGenderDTO[]> => genders,
  fetchNativeLanguages: async (): Promise<INativeLanguageDTO[]> => nativeLanguages,
  fetchHandednesses: async (): Promise<IHandednessDTO[]> => handednesses,
  fetchCurrentQuestions: async (): Promise<IQuestionDTO[]> => questionData,
}));

vi.mock("@app/util/mafildb_API/fetch", async () => ({
  ...((await vi.importActual("@app/util/mafildb_API/fetch")) as Record<string, unknown>),
  fetchProjects: async (): Promise<IProjectDTO[]> => projectsDev,
  fetchDevices: async (): Promise<IDeviceDTO[]> => devicesDev,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("phantom form page", () => {
  const setup = () => {
    render(<PhantomFormPage />);
  };

  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  // Data
  const genderOther = genders[2].translations[0].text;
  const nativeLanguageCzech = nativeLanguages[0].translations[0].text;
  const handednessUndetermined = handednesses[3].translations[0].text;
  const project1Text = getProjectText(projectsDev[0]);
  const device1Name = devicesDev[0].name;

  test("contains correct form buttons", async () => {
    setup();
    const buttonNames: string[] = ["form.common.buttons.finalize", "form.common.buttons.cancel"];

    const buttons = await screen.findAllByRole("button", { name: /^form\.common\.buttons/ });
    expect(buttons.length).toBe(buttonNames.length);
    buttonNames.forEach(async (buttonName, index) => expect(buttons[index].textContent).toBe(buttonName));
  });

  test("renders new form default values", async () => {
    setup();

    await waitFor(async () =>
      expect(screen.getByRole("form")).toHaveFormValues({
        project: "",
        device: "",
        measuredAt: format(new Date(), "dd.MM.yyyy"),
        name: "",
        surname: "",
        personalId: "",
        birthdate: "",
        gender: "", // is set to 'Other' in the FormProbandInfo component
        nativeLanguage: "",
        heightCm: "",
        weightKg: "",
        handedness: "",
        visualCorrection: "",
        visualCorrectionDioptre: "0",
      })
    );
  });

  test("birthdate is filled automatically from valid personal ID value and gender stays the same", async () => {
    setup();
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText("personalId"), "9606301232");

    expect(screen.getByLabelText("birthdate")).toHaveValue("30.06.1996");
    expect(screen.getByLabelText("gender")).toHaveValue(genderOther);
  });

  test("part of personal ID is filled automatically from valid birthdate", async () => {
    setup();
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText("birthdate"), "30.06.1996");

    expect(screen.getByLabelText("personalId")).toHaveValue("960630");
  });

  // TODO: this test never finishes.. maybe the second change to the visualCorrection input gets stucked?
  // test("auto-fill 0 for the visual correction value when visual correction is YES", async () => {
  //   setup();
  //   const user = userEvent.setup();
  //   const visualCorrectionInput = screen.getByLabelText("visualCorrection");
  //   const visualCorrectionDioptreInput = screen.getByLabelText("visualCorrectionDioptre");

  //   await user.click(visualCorrectionInput);
  //   await user.click(screen.getByRole("option", { name: "form.enums.visualCorrection.YES" }));
  //   await user.clear(visualCorrectionDioptreInput);
  //   await user.type(visualCorrectionDioptreInput, "-1,5");
  //   await user.click(visualCorrectionInput);
  //   await user.click(screen.getByRole("option", { name: "form.enums.visualCorrection.NO" }));

  //   expect(visualCorrectionDioptreInput).toHaveValue("0");
  // });

  test("submits form", async () => {
    setup();
    const user = userEvent.setup();

    await user.click(await screen.findByRole("combobox", { name: "project" }));
    const selectedProject = project1Text;
    await user.click(screen.getByRole("option", { name: selectedProject }));

    await user.click(screen.getByLabelText("device"));
    const selectedDevice = device1Name;
    await user.click(screen.getByRole("option", { name: selectedDevice }));

    const typedName = "John";
    await user.type(screen.getByLabelText("name"), typedName);

    const typedSurname = "Wick";
    await user.type(screen.getByLabelText("surname"), typedSurname);

    const typedPersonalId = "9606301232";
    await user.type(screen.getByLabelText("personalId"), typedPersonalId);
    // birthdate is filled automatically and gender stays the same
    const expectedBirthdate = "30.06.1996";

    await user.click(screen.getByLabelText("nativeLanguage"));
    const selectedNativeLanguage = nativeLanguageCzech;
    await user.click(screen.getByRole("option", { name: selectedNativeLanguage }));

    const typedHeight = "173";
    await user.type(screen.getByLabelText("heightCm"), typedHeight);

    const typedWeight = "70";
    await user.type(screen.getByLabelText("weightKg"), typedWeight);

    await user.click(screen.getByLabelText("visualCorrection"));
    const selectedVisualCorrection = "form.enums.visualCorrection.YES";
    await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

    const typedVisualCorrectionDioptre = "-1,5";
    await user.clear(screen.getByLabelText("visualCorrectionDioptre"));
    await user.type(screen.getByLabelText("visualCorrectionDioptre"), typedVisualCorrectionDioptre);

    await user.click(screen.getByLabelText("handedness"));
    const selectedHandedness = handednessUndetermined;
    await user.click(screen.getByRole("option", { name: selectedHandedness }));

    const expectedFormValues = {
      project: selectedProject,
      device: selectedDevice,
      measuredAt: format(new Date(), "dd.MM.yyyy"),
      name: typedName,
      surname: typedSurname,
      personalId: typedPersonalId,
      birthdate: expectedBirthdate,
      gender: genderOther,
      nativeLanguage: selectedNativeLanguage,
      heightCm: typedHeight,
      weightKg: typedWeight,
      handedness: selectedHandedness,
      visualCorrection: selectedVisualCorrection,
      visualCorrectionDioptre: typedVisualCorrectionDioptre,
    };
    expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues);

    const finalizeButton = screen.getByRole("button", { name: "form.common.buttons.finalize" });
    await user.click(finalizeButton);
    // TODO: change this to check calling POST method that will create a visit
    expect(mockedUseNavigate).toHaveBeenCalledOnce();
  });

  test("invalid visual correction value", async () => {
    setup();
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText("project"));
    await user.click(screen.getByRole("option", { name: project1Text }));

    await user.click(screen.getByLabelText("device"));
    await user.click(screen.getByRole("option", { name: device1Name }));

    await user.type(screen.getByLabelText("name"), "John");

    await user.type(screen.getByLabelText("surname"), "Wick");

    // birthdate is filled automatically and gender stays the same
    await user.type(screen.getByLabelText("personalId"), "9606301232");

    await user.click(screen.getByLabelText("nativeLanguage"));
    await user.click(screen.getByRole("option", { name: nativeLanguageCzech }));

    await user.type(screen.getByLabelText("heightCm"), "173");

    await user.type(screen.getByLabelText("weightKg"), "70");

    await user.click(screen.getByLabelText("handedness"));
    await user.click(screen.getByRole("option", { name: handednessUndetermined }));

    const finalizeButton = screen.getByRole("button", { name: "form.common.buttons.finalize" });

    /**
     * Test case: visualCorrection = YES and visualCorrectionDioptre = 0
     * Expected result: does not submit the form
     */
    await user.click(screen.getByLabelText("visualCorrection"));
    await user.click(screen.getByRole("option", { name: "form.enums.visualCorrection.YES" }));
    await user.click(finalizeButton);
    // TODO: change this to check calling POST method that will create a visit
    expect(mockedUseNavigate).toHaveBeenCalledTimes(0);
    mockedUseNavigate.mockClear();

    /**
     * Test case: visualCorrection = YES and visualCorrectionDioptre != 0
     * Expected result: submits the form
     */
    await user.clear(screen.getByLabelText("visualCorrectionDioptre"));
    await user.type(screen.getByLabelText("visualCorrectionDioptre"), "-1,5");
    await user.click(finalizeButton);
    // TODO: change this to check calling POST method that will create a visit
    expect(mockedUseNavigate).toHaveBeenCalledOnce();
    mockedUseNavigate.mockClear();
  });
});
