import { format } from "date-fns";
import i18n from "@app/i18n";
import { IOperator } from "@app/interfaces/auth";
import { IQuestionData, QuestionPartNumber } from "@app/interfaces/question";
import { AnswerOption, Gender, Handedness, IVisit, VisitState, VisualCorrection } from "@app/interfaces/visit";
import DuplicationFormPage from "@app/pages/DuplicationFormPage";
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
    disapprovalReason: null,
  },
  probandInfo: {
    name: "John",
    surname: "Wick",
    personalId: "0123456789",
    birthdate: new Date(1980, 8, 24),
    gender: Gender.MALE,
    height: 179,
    weight: 75,
    nativeLanguage: "Čeština",
    handedness: Handedness.RIGHT_HANDED,
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
const operator: IOperator = {
  name: "Peter",
  surname: "Pan",
  uco: "123456",
  email: "peter.pan@gmail.com",
  hasHigherPermission: true,
};

vi.mock("@app/hooks/auth/auth", () => ({
  useAuth: () => ({
    operator,
  }),
}));

//----------------------------------------------------------------------
// Mocking custom fetch methods
//----------------------------------------------------------------------
vi.mock("@app/util/fetch", async () => ({
  ...((await vi.importActual("@app/util/fetch")) as Record<string, unknown>),
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

    await waitFor(() =>
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
        handedness: "form.enums.handedness.RIGHT_HANDED",
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
        expect(noRadio).not.toBeChecked();
        expect(screen.getByLabelText(`answers.${index}.comment`)).toHaveTextContent(comment);
      } else {
        expect(yesRadio).not.toBeChecked();
        expect(noRadio).toBeChecked();
        expect(screen.queryByLabelText(`answers.${index}.comment`)).toBeNull();
      }
    });
  });
});
