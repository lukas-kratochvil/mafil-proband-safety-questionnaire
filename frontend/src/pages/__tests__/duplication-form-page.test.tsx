import { format } from "date-fns";
import i18n from "@i18n";
import { IOperator } from "@interfaces/auth";
import { IQuestionData, QuestionPartNumber } from "@interfaces/question";
import { AnswerOption, Gender, IVisit, SideDominance, VisitState, VisualCorrection } from "@interfaces/visit";
import DuplicationFormPage from "@pages/DuplicationFormPage";
import { render, screen, waitFor, within } from "@test-utils";

//----------------------------------------------------------------------
// Default data
//----------------------------------------------------------------------
const questionData: IQuestionData[] = [
  {
    id: "p1q01",
    partNumber: QuestionPartNumber.ONE,
    text: "Question1",
  },
  {
    id: "p1q02",
    partNumber: QuestionPartNumber.ONE,
    text: "Question2",
  },
  {
    id: "p2q01",
    partNumber: QuestionPartNumber.TWO,
    text: "Question3",
  },
  {
    id: "p2q02",
    partNumber: QuestionPartNumber.TWO,
    text: "Question4",
  },
];

const id = "ID1";
const comment = "Comment";

const visit: IVisit = {
  id,
  visitId: "VisitId1",
  state: VisitState.SIGNED,
  createdAt: new Date(),
  pdf: "",
  projectInfo: {
    project: "project1",
    projectId: "projectId1",
    device: "device1",
    deviceId: "deviceId1",
    isPhantom: false,
    measurementDate: new Date(),
  },
  probandInfo: {
    name: "Jong",
    surname: "Wick",
    personalId: "0123456789",
    birthdate: new Date(1980, 8, 24),
    gender: Gender.MALE,
    height: 179,
    weight: 75,
    nativeLanguage: "Čeština",
    sideDominance: SideDominance.RIGHT_HANDED,
    visualCorrection: VisualCorrection.NO,
    visualCorrectionValue: 0,
    email: "",
    phone: "",
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
// Mocking custom ErrorFeedback component
//----------------------------------------------------------------------
vi.mock("@components/form/inputs/ErrorFeedback", () => ({
  ErrorFeedback: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking custom authentication
//----------------------------------------------------------------------
const operator: IOperator = {
  name: "Peter",
  surname: "Pan",
  uco: "123456",
  email: "peter.pan@gmail.com",
  hasHigherPermission: true,
};

vi.mock("@hooks/auth/auth", () => ({
  useAuth: () => ({
    operator,
  }),
}));

//----------------------------------------------------------------------
// Mocking custom fetch methods
//----------------------------------------------------------------------
vi.mock("@util/fetch", async () => ({
  ...((await vi.importActual("@util/fetch")) as Record<string, unknown>),
  fetchVisit: async (): Promise<IVisit> => visit,
  fetchProjects: async (): Promise<string[]> => ["project1", "project2", "project3"],
  fetchDevices: async (): Promise<string[]> => ["device1", "device2", "device3"],
  fetchCurrentQuestions: async (): Promise<IQuestionData[]> => questionData,
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

  test("renders values from the visit being duplicated", async () => {
    setup();

    await waitFor(async () =>
      expect(screen.getByRole("form")).toHaveFormValues({
        project: "",
        device: "",
        measurementDate: format(new Date(), "dd.MM.yyyy"),
        name: visit.probandInfo.name,
        surname: visit.probandInfo.surname,
        personalId: visit.probandInfo.personalId,
        birthdate: format(visit.probandInfo.birthdate, "dd.MM.yyyy"),
        gender: "form.enums.gender.MALE",
        nativeLanguage: visit.probandInfo.nativeLanguage,
        height: visit.probandInfo.height.toString(),
        weight: visit.probandInfo.weight.toString(),
        visualCorrection: "form.enums.visualCorrection.NO",
        visualCorrectionValue: visit.probandInfo.visualCorrectionValue.toString(),
        sideDominance: "form.enums.sideDominance.RIGHT_HANDED",
        email: visit.probandInfo.email,
        phone: visit.probandInfo.phone,
      })
    );

    const questions = await screen.findAllByRole("radiogroup");
    expect(questions.length).toEqual(questionData.length);

    questions.forEach(async (question, index) => {
      const yesRadio = within(question).getByRole("radio", { name: "form.safetyQuestions.yes" });
      const noRadio = within(question).getByRole("radio", { name: "form.safetyQuestions.no" });

      if (index % 2 === 0) {
        expect(yesRadio).toBeChecked();
        expect(screen.getByLabelText(`answers.${index}.comment`)).toHaveTextContent(comment);
        expect(noRadio).not.toBeChecked();
      } else {
        expect(yesRadio).not.toBeChecked();
        expect(noRadio).toBeChecked();
      }
    });
  });
});
