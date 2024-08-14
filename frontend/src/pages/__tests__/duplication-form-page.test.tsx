import { format } from "date-fns";
import type { Device } from "@app/model/device";
import type { NativeLanguage } from "@app/model/language";
import type { Project } from "@app/model/project";
import type { DuplicatedVisitIncludingQuestions } from "@app/model/visit";
import DuplicationFormPage from "@app/pages/DuplicationFormPage";
import type { GenderDTO, HandednessDTO, PdfDTO, QuestionDTO } from "@app/util/server_API/dto";
import { devicesTest } from "@test/data/devices";
import { gendersTest } from "@test/data/genders";
import { handednessesTest } from "@test/data/handednesses";
import { nativeLanguagesTest } from "@test/data/languages";
import { operatorMRHigPermTest } from "@test/data/operators";
import { pdfTest } from "@test/data/pdf";
import { projectsTest } from "@test/data/projects";
import { questionsTest } from "@test/data/questions";
import { subjectsTest } from "@test/data/subjects";
import { render, screen, within } from "@test/utils";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const id = "ID1";
const commentText = "Comment";

const visit: DuplicatedVisitIncludingQuestions = {
  uuid: "1",
  visitId: "VisitId1",
  isPhantom: false,
  measurementDate: new Date(),
  subject: subjectsTest[0]!,
  project: projectsTest[0]!,
  deviceId: 1,
  gender: gendersTest[0]!,
  heightCm: 179,
  weightKg: 75,
  handedness: handednessesTest[0]!,
  visualCorrectionDioptre: 0,
  answersIncludingQuestions: questionsTest.map((question, index) => ({
    questionId: question.id,
    mustBeApproved: index % 2 === 0,
    answer: index % 2 === 0 ? "YES" : "NO",
    comment: index % 2 === 0 ? commentText : "",
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
vi.mock("@app/hooks/auth/auth", () => ({
  useAuth: () => ({
    operator: operatorMRHigPermTest,
  }),
}));

//----------------------------------------------------------------------
// Mocking server API calls
//----------------------------------------------------------------------
const newDuplicatedVisitFormId = "id123";

vi.mock("@app/util/server_API/calls", async () => ({
  fetchGenders: async (): Promise<GenderDTO[]> => gendersTest,
  fetchHandednesses: async (): Promise<HandednessDTO[]> => handednessesTest,
  fetchCurrentQuestions: async (): Promise<QuestionDTO[]> => questionsTest,
  createDuplicatedVisitFormForApproval: async (): Promise<string> => newDuplicatedVisitFormId,
  generateProbandPdf: async (): Promise<PdfDTO> => pdfTest,
  generatePhantomPdf: async (): Promise<PdfDTO> => pdfTest,
}));

//----------------------------------------------------------------------
// Mocking MAFILDB API calls
//----------------------------------------------------------------------
vi.mock("@app/util/mafildb_API/calls", async () => ({
  fetchNativeLanguages: async (): Promise<NativeLanguage[]> => nativeLanguagesTest,
  fetchProjects: async (): Promise<Project[]> => projectsTest,
  fetchDevices: async (): Promise<Device[]> => devicesTest,
  fetchDuplicatedVisit: async (): Promise<DuplicatedVisitIncludingQuestions> => visit,
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
    // ARRANGE
    const buttonNames: string[] = [
      "form.common.buttons.finalize",
      "form.common.buttons.disapprove",
      "form.common.buttons.edit",
      "form.common.buttons.cancel",
    ];

    // ACT
    setup();
    const buttons = await screen.findAllByRole("button", { name: /^form\.common\.buttons/ });

    // ASSERT
    expect(buttons.length).toBe(buttonNames.length);
    buttonNames.forEach(async (buttonName, index) => expect(buttons[index]?.textContent).toBe(buttonName));
  });

  test("renders values from the visit being duplicated", async () => {
    // ARRANGE
    const expectedFormValues = {
      project: "",
      device: "",
      measuredAt: format(new Date(), "dd.MM.yyyy"),
      name: visit.subject.name,
      surname: visit.subject.surname,
      personalId: visit.subject.personalId,
      birthdate: format(visit.subject.birthdate, "dd.MM.yyyy"),
      gender: visit.gender.translations[0]?.text,
      nativeLanguage: visit.subject.nativeLanguage.nativeName,
      heightCm: visit.heightCm.toString(),
      weightKg: visit.weightKg.toString(),
      visualCorrection: "form.options.visualCorrection.no",
      visualCorrectionDioptre: visit.visualCorrectionDioptre.toString(),
      handedness: visit.handedness.translations[0]?.text,
      email: visit.subject.email,
      phone: visit.subject.phone,
    };

    // ACT
    setup();
    const form = await screen.findByRole("form");
    const questionsRadios = await screen.findAllByRole("radiogroup");

    // ASSERT
    expect(form).toHaveFormValues(expectedFormValues);
    expect(questionsRadios.length).toEqual(questionsTest.length);
    questionsRadios.forEach((questionInput, i) => {
      const yesRadio = within(questionInput).getByRole("radio", { name: "form.safetyQuestions.yes" });
      const noRadio = within(questionInput).getByRole("radio", { name: "form.safetyQuestions.no" });
      const commentField = screen.queryByRole("textbox", { name: `answers.${i}.comment` });

      if (i % 2 === 0) {
        expect(yesRadio).toBeChecked();
        expect(noRadio).not.toBeChecked();
        expect(commentField).toHaveTextContent(commentText);
      } else {
        expect(yesRadio).not.toBeChecked();
        expect(noRadio).toBeChecked();
        expect(commentField).toBeNull();
      }
    });
  });
});
