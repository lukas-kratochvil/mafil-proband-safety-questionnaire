import { format } from "date-fns";
import { devicesDev, projectsDev } from "@app/data/form_data";
import { genders, handednesses, nativeLanguages } from "@app/data/translated_entities_data";
import i18n from "@app/i18n";
import { AnswerOption } from "@app/model/form";
import { IVisit, VisitStateDEV, VisualCorrection } from "@app/model/visit";
import DuplicationFormPage from "@app/pages/DuplicationFormPage";
import { IDeviceDTO, IProjectDTO } from "@app/util/mafildb_API/dto";
import { IGenderDTO, IHandednessDTO, INativeLanguageDTO, IOperatorDTO, IQuestionDTO } from "@app/util/server_API/dto";
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
    hiddenByGenders: [],
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
    hiddenByGenders: [],
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
    hiddenByGenders: [],
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
    hiddenByGenders: [],
  },
];

const id = "ID1";
const comment = "Comment";

const visit: IVisit = {
  id,
  createdAt: new Date(),
  visitId: "VisitId1",
  state: VisitStateDEV.SIGNED,
  name: "John",
  surname: "Wick",
  personalId: "0123456789",
  birthdate: new Date(1980, 8, 24),
  gender: genders[0],
  heightCm: 179,
  weightKg: 75,
  nativeLanguage: nativeLanguages[0],
  handedness: handednesses[0],
  visualCorrection: VisualCorrection.NO,
  visualCorrectionDioptre: 0,
  email: "",
  phone: "",
  pdf: "",
  projectInfo: {
    projectAcronym: "Proj1",
    projectId: "projectId1",
    deviceName: "device1",
    deviceId: "deviceId1",
    isPhantom: false,
    measuredAt: new Date(),
    disapprovalReason: null,
  },
  answers: questionData.map((question, index) => ({
    questionId: question.id,
    partNumber: question.partNumber,
    answer: index % 2 === 0 ? AnswerOption.YES : AnswerOption.NO,
    comment: index % 2 === 0 ? comment : "",
  })),
};

//----------------------------------------------------------------------
// Mocking react-router-dom hooks
//----------------------------------------------------------------------
const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as Record<string, unknown>),
  useNavigate: () => mockedUseNavigate,
  useParams: () => ({
    id,
  }),
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
// Mocking custom authentication
//----------------------------------------------------------------------
const operator: IOperatorDTO = {
  id: "1",
  name: "Peter",
  surname: "Pan",
  uco: "123456",
  email: "peter.pan@gmail.com",
  role: "MR_HIGH_PERM",
};

vi.mock("@app/hooks/auth/auth", () => ({
  useAuth: () => ({
    operator,
  }),
}));

//----------------------------------------------------------------------
// Mocking custom fetch methods
//----------------------------------------------------------------------
const newDuplicatedVisitFormId = "id123";

vi.mock("@app/util/server_API/fetch", async () => ({
  ...((await vi.importActual("@app/util/server_API/fetch")) as Record<string, unknown>),
  fetchGenders: async (): Promise<IGenderDTO[]> => genders,
  fetchNativeLanguages: async (): Promise<INativeLanguageDTO[]> => nativeLanguages,
  fetchHandednesses: async (): Promise<IHandednessDTO[]> => handednesses,
  fetchCurrentQuestions: async (): Promise<IQuestionDTO[]> => questionData,
  fetchQuestion: async (): Promise<IQuestionDTO> => questionData[0],
  createDuplicatedVisitFormForApproval: async (): Promise<string> => newDuplicatedVisitFormId,
}));

vi.mock("@app/util/mafildb_API/fetch", async () => ({
  ...((await vi.importActual("@app/util/mafildb_API/fetch")) as Record<string, unknown>),
  fetchProjects: async (): Promise<IProjectDTO[]> => projectsDev,
  fetchDevices: async (): Promise<IDeviceDTO[]> => devicesDev,
  fetchVisit: async (): Promise<IVisit> => visit,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("duplication form page", () => {
  const setup = () => {
    render(<DuplicationFormPage />);
  };

  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains correct form buttons", async () => {
    setup();
    const buttonNames: string[] = [
      "form.common.buttons.finalize",
      "form.common.buttons.disapprove",
      "form.common.buttons.edit",
      "form.common.buttons.cancel",
    ];

    const buttons = await screen.findAllByRole("button", { name: /^form\.common\.buttons/ });
    expect(buttons.length).toBe(buttonNames.length);
    buttonNames.forEach(async (buttonName, index) => expect(buttons[index].textContent).toBe(buttonName));
  });

  test("renders values from the visit being duplicated", async () => {
    setup();

    const expectedFormValues = {
      project: "",
      device: "",
      measuredAt: format(new Date(), "dd.MM.yyyy"),
      name: visit.name,
      surname: visit.surname,
      personalId: visit.personalId,
      birthdate: format(visit.birthdate, "dd.MM.yyyy"),
      gender: visit.gender.translations[0].text,
      nativeLanguage: visit.nativeLanguage.translations[0].text,
      heightCm: visit.heightCm.toString(),
      weightKg: visit.weightKg.toString(),
      visualCorrection: "form.enums.visualCorrection.NO",
      visualCorrectionDioptre: visit.visualCorrectionDioptre.toString(),
      handedness: visit.handedness.translations[0].text,
      email: visit.email,
      phone: visit.phone,
    };

    await waitFor(() => expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues));

    const questions = await screen.findAllByRole("radiogroup");
    expect(questions.length).toEqual(questionData.length);

    // TODO: correct safety questions checkbox tests
    // questions.forEach(async (question, index) => {
    //   const yesRadio = await within(question).findByRole("radio", { name: "form.safetyQuestions.yes" });
    //   const noRadio = await within(question).findByRole("radio", { name: "form.safetyQuestions.no" });

    //   if (index % 2 === 0) {
    //     // expect(yesRadio).toBeChecked();
    //     expect(noRadio).not.toBeChecked();
    //     expect(screen.getByLabelText(`answers.${index}.comment`)).toHaveTextContent(comment);
    //   } else {
    //     expect(yesRadio).not.toBeChecked();
    //     // expect(noRadio).toBeChecked();
    //     expect(screen.queryByLabelText(`answers.${index}.comment`)).toBeNull();
    //   }
    // });
  });
});
