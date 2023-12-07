import { format } from "date-fns";
import { devicesTest } from "@app/__tests__/data/devices";
import { gendersTest } from "@app/__tests__/data/genders";
import { handednessesTest } from "@app/__tests__/data/handednesses";
import { nativeLanguagesTest } from "@app/__tests__/data/native-languages";
import { operatorMRHigPermTest } from "@app/__tests__/data/operators";
import { pdfTest } from "@app/__tests__/data/pdf";
import { projectsTest } from "@app/__tests__/data/projects";
import { questionsTest } from "@app/__tests__/data/questions";
import { subjectsTest } from "@app/__tests__/data/subjects";
import { IDevice } from "@app/model/device";
import { AnswerOption } from "@app/model/form";
import { IProject } from "@app/model/project";
import { IDuplicatedVisitIncludingQuestions } from "@app/model/visit";
import DuplicationFormPage from "@app/pages/DuplicationFormPage";
import { VisitState } from "@app/util/mafildb_API/dto";
import {
  INativeLanguageDTO,
  IOrderedGenderDTO,
  IOrderedHandednessDTO,
  IOrderedQuestionDTO,
  IPdfDTO,
} from "@app/util/server_API/dto";
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
  state: VisitState.SIGNED_PHYSICALLY,
  subject: subjectsTest[0],
  project: projectsTest[0],
  device: devicesTest[0],
  gender: gendersTest[0],
  heightCm: 179,
  weightKg: 75,
  nativeLanguage: nativeLanguagesTest[0],
  handedness: handednessesTest[0],
  visualCorrectionDioptre: 0,
  answersIncludingQuestions: questionsTest.map((question, index) => ({
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
    operator: operatorMRHigPermTest,
  }),
}));

//----------------------------------------------------------------------
// Mocking server API calls
//----------------------------------------------------------------------
const newDuplicatedVisitFormId = "id123";

vi.mock("@app/util/server_API/calls", async () => ({
  fetchGenders: async (): Promise<IOrderedGenderDTO[]> => gendersTest,
  fetchNativeLanguages: async (): Promise<INativeLanguageDTO[]> => nativeLanguagesTest,
  fetchHandednesses: async (): Promise<IOrderedHandednessDTO[]> => handednessesTest,
  fetchCurrentQuestions: async (): Promise<IOrderedQuestionDTO[]> => questionsTest,
  createDuplicatedVisitFormForApproval: async (): Promise<string> => newDuplicatedVisitFormId,
  generateProbandPdf: async (): Promise<IPdfDTO> => pdfTest,
  generatePhantomPdf: async (): Promise<IPdfDTO> => pdfTest,
}));

//----------------------------------------------------------------------
// Mocking MAFILDB API calls
//----------------------------------------------------------------------
vi.mock("@app/util/mafildb_API/calls", async () => ({
  fetchProjects: async (): Promise<IProject[]> => projectsTest,
  fetchDevices: async (): Promise<IDevice[]> => devicesTest,
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
      name: visit.subject.name,
      surname: visit.subject.surname,
      personalId: visit.subject.personalId,
      birthdate: format(visit.subject.birthdate, "dd.MM.yyyy"),
      gender: visit.gender.translations[0].text,
      nativeLanguage: visit.nativeLanguage.translations[0].text,
      heightCm: visit.heightCm.toString(),
      weightKg: visit.weightKg.toString(),
      visualCorrection: "form.enums.visualCorrection.NO",
      visualCorrectionDioptre: visit.visualCorrectionDioptre.toString(),
      handedness: visit.handedness.translations[0].text,
      email: visit.subject.email,
      phone: visit.subject.phone,
    };

    await waitFor(() => expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues));

    const questions = await screen.findAllByRole("radiogroup");
    expect(questions.length).toEqual(questionsTest.length);

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
