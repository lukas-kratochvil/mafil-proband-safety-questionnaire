import { format } from "date-fns";
import { gendersDev } from "@app/__tests__/data/genders";
import { handednessesDev } from "@app/__tests__/data/handednesses";
import { nativeLanguagesDev } from "@app/__tests__/data/native-languages";
import { operatorMRHigPermDev } from "@app/__tests__/data/operators";
import { pdfDev } from "@app/__tests__/data/pdf";
import { questionsDev } from "@app/__tests__/data/questions";
import { AnswerOption } from "@app/model/form";
import { IDuplicatedVisitIncludingQuestions } from "@app/model/visit";
import DuplicationFormPage from "@app/pages/DuplicationFormPage";
import { devicesDev, projectsDev } from "@app/util/mafildb_API/data.dev";
import { IDeviceDTO, IProjectDTO, VisitState } from "@app/util/mafildb_API/dto";
import { IGenderDTO, IHandednessDTO, INativeLanguageDTO, IPdfDTO, IQuestionDTO } from "@app/util/server_API/dto";
import { render, screen, waitFor, within } from "@test-utils";

//----------------------------------------------------------------------
// Default data
//----------------------------------------------------------------------
const id = "ID1";
const comment = "Comment";

const visit: IDuplicatedVisitIncludingQuestions = {
  date: new Date(),
  visitId: "VisitId1",
  isPhantom: false,
  measurementDate: new Date(),
  probandLanguageCode: "en",
  state: VisitState.SIGNED_PHYSICALLY,
  name: "John",
  surname: "Wick",
  personalId: "0123456789",
  birthdate: new Date(1980, 8, 24),
  gender: gendersDev[0],
  heightCm: 179,
  weightKg: 75,
  nativeLanguage: nativeLanguagesDev[0],
  handedness: handednessesDev[0],
  visualCorrectionDioptre: 0,
  email: "",
  phone: "",
  answersIncludingQuestions: questionsDev.map((question, index) => ({
    questionId: question.id,
    mustBeApproved: index % 2 === 0,
    answer: index % 2 === 0 ? AnswerOption.YES : AnswerOption.NO,
    comment: index % 2 === 0 ? comment : "",
    order: question.order,
    hiddenByGenders: question.hiddenByGenders,
    partNumber: question.partNumber,
    translations: question.translations,
    updatedAt: question.updatedAt,
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
// Mocking custom ErrorMessage component
//----------------------------------------------------------------------
vi.mock("@app/components/form/inputs/ErrorMessage", () => ({
  ErrorMessage: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
vi.mock("@app/hooks/auth/AuthProvider", () => ({
  useAuth: () => ({
    operator: operatorMRHigPermDev,
  }),
}));

//----------------------------------------------------------------------
// Mocking server API calls
//----------------------------------------------------------------------
const newDuplicatedVisitFormId = "id123";

vi.mock("@app/util/server_API/calls", async () => ({
  fetchGenders: async (): Promise<IGenderDTO[]> => gendersDev,
  fetchNativeLanguages: async (): Promise<INativeLanguageDTO[]> => nativeLanguagesDev,
  fetchHandednesses: async (): Promise<IHandednessDTO[]> => handednessesDev,
  fetchCurrentQuestions: async (): Promise<IQuestionDTO[]> => questionsDev,
  createDuplicatedVisitFormForApproval: async (): Promise<string> => newDuplicatedVisitFormId,
  generateProbandPdf: async (): Promise<IPdfDTO> => pdfDev,
  generatePhantomPdf: async (): Promise<IPdfDTO> => pdfDev,
}));

//----------------------------------------------------------------------
// Mocking MAFILDB API calls
//----------------------------------------------------------------------
vi.mock("@app/util/mafildb_API/calls", async () => ({
  fetchProjects: async (): Promise<IProjectDTO[]> => projectsDev,
  fetchDevices: async (): Promise<IDeviceDTO[]> => devicesDev,
  fetchDuplicatedVisit: async (): Promise<IDuplicatedVisitIncludingQuestions> => visit,
  createFinalizedVisit: async (): Promise<string> => "visitId",
  createPhantomVisit: async (): Promise<string> => "visitId",
  addPdfToVisit: async (): Promise<string> => "fileId",
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("duplication form page", () => {
  const setup = () => {
    render(<DuplicationFormPage />);
  };

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
    expect(questions.length).toEqual(questionsDev.length);

    questions.forEach(async (question, index) => {
      const yesRadio = await within(question).findByRole("radio", { name: "form.safetyQuestions.yes" });
      const noRadio = await within(question).findByRole("radio", { name: "form.safetyQuestions.no" });

      if (index % 2 === 0) {
        expect(yesRadio).toBeChecked();
        expect(noRadio).not.toBeChecked();
        // TODO: correct comment check
        // expect(screen.getByLabelText(`answers.${index}.comment`)).toHaveTextContent(comment);
      } else {
        expect(yesRadio).not.toBeChecked();
        expect(noRadio).toBeChecked();
        expect(screen.queryByLabelText(`answers.${index}.comment`)).toBeNull();
      }
    });
  });
});
