import userEvent from "@testing-library/user-event";
import { gendersTest } from "@app/__tests__/data/genders";
import { handednessesTest } from "@app/__tests__/data/handednesses";
import { nativeLanguagesTest } from "@app/__tests__/data/languages";
import { questionsTest } from "@app/__tests__/data/questions";
import type { NativeLanguage } from "@app/model/language";
import ProbandFormPage from "@app/pages/ProbandFormPage";
import { RoutingPath } from "@app/routing-paths";
import * as serverCalls from "@app/util/server_API/calls";
import type { GenderDTO, HandednessDTO, HTMLCardDTO, QuestionDTO } from "@app/util/server_API/dto";
import { render, screen, within } from "@test-utils";

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
vi.mock("@app/hooks/auth/AuthProvider", () => ({
  useAuth: () => ({
    operator: undefined,
  }),
}));

//----------------------------------------------------------------------
// Mocking server API calls
//----------------------------------------------------------------------
const htmlCard: HTMLCardDTO = {
  title: "title",
  html: "text only",
};

vi.mock("@app/util/server_API/calls", async () => ({
  fetchGenders: async (): Promise<GenderDTO[]> => gendersTest,
  fetchHandednesses: async (): Promise<HandednessDTO[]> => handednessesTest,
  fetchCurrentQuestions: async (): Promise<QuestionDTO[]> => questionsTest,
  createProbandVisitForm: async (): Promise<string> => "",
  fetchEntryInfo: async (): Promise<HTMLCardDTO> => htmlCard,
  fetchSafetyInfo: async (): Promise<HTMLCardDTO> => htmlCard,
  fetchBeforeExamination: async (): Promise<HTMLCardDTO> => htmlCard,
  fetchExaminationConsent: async (): Promise<HTMLCardDTO> => htmlCard,
  fetchProbandContactRequest: async (): Promise<HTMLCardDTO> => htmlCard,
  fetchProbandContactConsent: async (): Promise<HTMLCardDTO> => htmlCard,
}));

//----------------------------------------------------------------------
// Mocking MAFILDB API calls
//----------------------------------------------------------------------
vi.mock("@app/util/mafildb_API/calls", async () => ({
  fetchNativeLanguages: async (): Promise<NativeLanguage[]> => nativeLanguagesTest,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("proband form page", () => {
  const setup = () => {
    render(<ProbandFormPage />);
  };

  const createProbandVisitFormSpy = vi.spyOn(serverCalls, "createProbandVisitForm");

  afterEach(() => {
    createProbandVisitFormSpy.mockClear();
  });

  // Data
  const genderMan = gendersTest[0]?.translations[0]?.text;
  const genderWoman = gendersTest[1]?.translations[0]?.text;
  const nativeLanguageCzech = nativeLanguagesTest[0]?.nativeName;
  const handednessUndetermined = handednessesTest[3]?.translations[0]?.text;

  test("contains correct form buttons", async () => {
    // ARRANGE
    const buttonNames: string[] = ["form.common.buttons.agree"];

    // ACT
    setup();
    const buttons = await screen.findAllByRole("button", { name: /^form\.common\.buttons/ });

    // ASSERT
    expect(buttons.length).toBe(buttonNames.length);
    buttonNames.forEach(async (buttonName, index) => expect(buttons[index]?.textContent).toBe(buttonName));
  });

  test("renders new form default values", async () => {
    // ACT
    setup();
    const form = await screen.findByRole("form");
    const questions = await screen.findAllByRole("radiogroup");

    // ASSERT
    const expectedValues = {
      name: "",
      surname: "",
      personalId: "",
      birthdate: "",
      gender: "",
      nativeLanguage: "",
      heightCm: "",
      weightKg: "",
      visualCorrection: "",
      visualCorrectionDioptre: "0",
      handedness: "",
    };
    expect(form).toHaveFormValues(expectedValues);
    expect(questions.length).toEqual(questionsTest.length);
  });

  describe("auto-fills", () => {
    test("birthdate and MALE gender is auto-filled from valid personal ID value", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();
      await user.type(await screen.findByLabelText("personalId"), "9606301232");
      const birthdateInput = screen.getByLabelText("birthdate");
      const genderInput = screen.getByLabelText("gender");

      // ASSERT
      expect(birthdateInput).toHaveValue("30.06.1996");
      expect(genderInput).toHaveValue(genderMan);
    });

    test("birthdate and FEMALE gender is auto-filled from valid personal ID value", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();
      await user.type(await screen.findByLabelText("personalId"), "9656301237");
      const birthdateInput = screen.getByLabelText("birthdate");
      const genderInput = screen.getByLabelText("gender");

      // ASSERT
      expect(birthdateInput).toHaveValue("30.06.1996");
      expect(genderInput).toHaveValue(genderWoman);
    });

    test("part of personal ID is auto-filled from valid birthdate and MALE gender", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();
      await user.type(await screen.findByLabelText("birthdate"), "30.06.1996");
      await user.click(screen.getByRole("combobox", { name: "gender" }));
      await user.click(screen.getByRole("option", { name: genderMan }));
      const personalIdInput = screen.getByLabelText("personalId");

      // ASSERT
      expect(personalIdInput).toHaveValue("960630");
    });

    test("part of personal ID is auto-filled from valid birthdate and FEMALE gender", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();
      await user.type(await screen.findByLabelText("birthdate"), "30.06.1996");
      await user.click(screen.getByRole("combobox", { name: "gender" }));
      await user.click(screen.getByRole("option", { name: genderWoman }));
      const personalIdInput = screen.getByLabelText("personalId");

      // ASSERT
      expect(personalIdInput).toHaveValue("965630");
    });

    test("auto-fill 0 for the visual correction value when visual correction is YES", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();
      const visualCorrectionInput = await screen.findByRole("combobox", { name: "visualCorrection" });
      const visualCorrectionDioptreInput = screen.getByLabelText("visualCorrectionDioptre");

      await user.click(visualCorrectionInput);
      await user.click(screen.getByRole("option", { name: "form.options.visualCorrection.yes" }));
      await user.clear(visualCorrectionDioptreInput);
      await user.type(visualCorrectionDioptreInput, "-1,5");
      await user.click(visualCorrectionInput);
      await user.click(screen.getByRole("option", { name: "form.options.visualCorrection.no" }));

      // ASSERT
      expect(visualCorrectionDioptreInput).toHaveValue("0");
    });
  });

  describe("submitting", () => {
    test("do not submit when questions not filled", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();

      const typedName = "John";
      await user.type(await screen.findByLabelText("name"), typedName);

      const typedSurname = "Wick";
      await user.type(screen.getByLabelText("surname"), typedSurname);

      const typedPersonalId = "9656301237";
      await user.type(screen.getByLabelText("personalId"), typedPersonalId);
      // birthdate is filled automatically
      const expectedBirthdate = "30.06.1996";
      // gender is filled automatically
      const expectedGender = genderWoman;

      await user.click(screen.getByRole("combobox", { name: "nativeLanguage" }));
      const selectedNativeLanguage = nativeLanguageCzech;
      await user.click(screen.getByRole("option", { name: selectedNativeLanguage }));

      const typedHeight = "173";
      await user.type(screen.getByLabelText("heightCm"), typedHeight);

      const typedWeight = "70";
      await user.type(screen.getByLabelText("weightKg"), typedWeight);

      await user.click(screen.getByRole("combobox", { name: "visualCorrection" }));
      const selectedVisualCorrection = "form.options.visualCorrection.yes";
      await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

      const typedVisualCorrectionDioptre = "-1,5";
      const visualCorrectionDioptreInput = screen.getByLabelText("visualCorrectionDioptre");
      await user.clear(visualCorrectionDioptreInput);
      await user.type(visualCorrectionDioptreInput, typedVisualCorrectionDioptre);

      await user.click(screen.getByRole("combobox", { name: "handedness" }));
      const selectedHandedness = handednessUndetermined;
      await user.click(screen.getByRole("option", { name: selectedHandedness }));

      const formWithoutQuestionsFilled = screen.getByRole("form");

      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });

      // ASSERT
      const expectedFormValues = {
        name: typedName,
        surname: typedSurname,
        personalId: typedPersonalId,
        birthdate: expectedBirthdate,
        gender: expectedGender,
        nativeLanguage: selectedNativeLanguage,
        heightCm: typedHeight,
        weightKg: typedWeight,
        visualCorrection: selectedVisualCorrection,
        visualCorrectionDioptre: typedVisualCorrectionDioptre,
        handedness: selectedHandedness,
      };
      expect(formWithoutQuestionsFilled).toHaveFormValues(expectedFormValues);

      await user.click(agreeButton);
      expect(createProbandVisitFormSpy).not.toHaveBeenCalled();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });

    test("submits form with all fields filled", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();

      await user.type(await screen.findByLabelText("name"), "John");
      await user.type(screen.getByLabelText("surname"), "Wick");
      await user.type(screen.getByLabelText("personalId"), "9656301237");
      await user.click(screen.getByRole("combobox", { name: "nativeLanguage" }));
      await user.click(screen.getByRole("option", { name: nativeLanguageCzech }));
      await user.type(screen.getByLabelText("heightCm"), "173");
      await user.type(screen.getByLabelText("weightKg"), "70");
      await user.click(screen.getByRole("combobox", { name: "visualCorrection" }));
      await user.click(screen.getByRole("option", { name: "form.options.visualCorrection.yes" }));
      const visualCorrectionDioptreInput = screen.getByLabelText("visualCorrectionDioptre");
      await user.clear(visualCorrectionDioptreInput);
      await user.type(visualCorrectionDioptreInput, "-1,5");
      await user.click(screen.getByRole("combobox", { name: "handedness" }));
      await user.click(screen.getByRole("option", { name: handednessUndetermined }));

      const questionsRadios = screen.getAllByRole("radiogroup");
      questionsRadios.forEach(async (question, index) => {
        const answerLabel = index % 2 === 0 ? "form.safetyQuestions.yes" : "form.safetyQuestions.no";
        await user.click(within(question).getByRole("radio", { name: answerLabel }));
      });

      // takes us to the second part of the proband form
      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);

      // click on the checkbox to show contacts form
      const checkbox = await screen.findByRole("checkbox");
      await user.click(checkbox);

      const typedEmail = "name.surname@mail.com";
      await user.type(screen.getByLabelText("email"), typedEmail);

      const typedPhone = "123456789";
      await user.type(screen.getByLabelText("phone"), typedPhone);

      const contactsForm = screen.getByRole("form");
      const agreeButton2 = screen.getByRole("button", { name: "form.common.buttons.agree" });

      // ASSERT
      const expectedValues = {
        email: typedEmail,
        phone: typedPhone,
      };
      expect(contactsForm).toHaveFormValues(expectedValues);

      await user.click(agreeButton2);
      expect(createProbandVisitFormSpy).toHaveBeenCalledOnce();
      expect(mockedUseNavigate).toHaveBeenCalledWith(RoutingPath.PROBAND_HOME);
    });

    test("submits form without proband contact fields filled", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();

      await user.type(await screen.findByLabelText("name"), "John");
      await user.type(screen.getByLabelText("surname"), "Wick");
      await user.type(screen.getByLabelText("personalId"), "9656301237");
      await user.click(screen.getByRole("combobox", { name: "nativeLanguage" }));
      await user.click(screen.getByRole("option", { name: nativeLanguageCzech }));
      await user.type(screen.getByLabelText("heightCm"), "173");
      await user.type(screen.getByLabelText("weightKg"), "70");
      await user.click(screen.getByRole("combobox", { name: "visualCorrection" }));
      await user.click(screen.getByRole("option", { name: "form.options.visualCorrection.yes" }));
      const visualCorrectionDioptreInput = screen.getByLabelText("visualCorrectionDioptre");
      await user.clear(visualCorrectionDioptreInput);
      await user.type(visualCorrectionDioptreInput, "-1,5");
      await user.click(screen.getByRole("combobox", { name: "handedness" }));
      await user.click(screen.getByRole("option", { name: handednessUndetermined }));

      const questionsRadios = screen.getAllByRole("radiogroup");
      questionsRadios.forEach(async (question, index) => {
        const answerLabel = index % 2 === 0 ? "form.safetyQuestions.yes" : "form.safetyQuestions.no";
        await user.click(within(question).getByRole("radio", { name: answerLabel }));
      });

      // takes us to the second part of the proband form
      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);

      // must be here to properly load the second part of the proband form, otherwise 'complete button' will not be found
      await screen.findByRole("checkbox");

      // submit
      const completeButton = await screen.findByRole("button", { name: "form.common.buttons.complete" });
      await user.click(completeButton);

      // ASSERT
      expect(createProbandVisitFormSpy).toHaveBeenCalledOnce();
      expect(mockedUseNavigate).toHaveBeenCalledWith(RoutingPath.PROBAND_HOME);
    });

    test("does not submit when email filled and phone number not", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();

      await user.type(await screen.findByLabelText("name"), "John");
      await user.type(screen.getByLabelText("surname"), "Wick");
      await user.type(screen.getByLabelText("personalId"), "9656301237");
      await user.click(screen.getByRole("combobox", { name: "nativeLanguage" }));
      await user.click(screen.getByRole("option", { name: nativeLanguageCzech }));
      await user.type(screen.getByLabelText("heightCm"), "173");
      await user.type(screen.getByLabelText("weightKg"), "70");
      await user.click(screen.getByRole("combobox", { name: "visualCorrection" }));
      await user.click(screen.getByRole("option", { name: "form.options.visualCorrection.yes" }));
      const visualCorrectionDioptreInput = screen.getByLabelText("visualCorrectionDioptre");
      await user.clear(visualCorrectionDioptreInput);
      await user.type(visualCorrectionDioptreInput, "-1,5");
      await user.click(screen.getByRole("combobox", { name: "handedness" }));
      await user.click(screen.getByRole("option", { name: handednessUndetermined }));

      const questionsRadios = screen.getAllByRole("radiogroup");
      questionsRadios.forEach(async (question, index) => {
        const answerLabel = index % 2 === 0 ? "form.safetyQuestions.yes" : "form.safetyQuestions.no";
        await user.click(within(question).getByRole("radio", { name: answerLabel }));
      });

      // takes us to the second part of the proband form
      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);

      // click on the checkbox to show contacts form
      const checkbox = await screen.findByRole("checkbox");
      await user.click(checkbox);

      const typedEmail = "name.surname@mail.com";
      await user.type(screen.getByLabelText("email"), typedEmail);

      const contactsForm = screen.getByRole("form");
      const agreeButton2 = screen.getByRole("button", { name: "form.common.buttons.agree" });

      // ASSERT
      const expectedValues = {
        email: typedEmail,
        phone: "",
      };
      expect(contactsForm).toHaveFormValues(expectedValues);

      await user.click(agreeButton2);
      expect(createProbandVisitFormSpy).not.toHaveBeenCalled();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });

    test("does not submit when phone number filled and email not", async () => {
      // ARRANGE
      const user = userEvent.setup();

      // ACT
      setup();

      await user.type(await screen.findByLabelText("name"), "John");
      await user.type(screen.getByLabelText("surname"), "Wick");
      await user.type(screen.getByLabelText("personalId"), "9656301237");
      await user.click(screen.getByRole("combobox", { name: "nativeLanguage" }));
      await user.click(screen.getByRole("option", { name: nativeLanguageCzech }));
      await user.type(screen.getByLabelText("heightCm"), "173");
      await user.type(screen.getByLabelText("weightKg"), "70");
      await user.click(screen.getByRole("combobox", { name: "visualCorrection" }));
      await user.click(screen.getByRole("option", { name: "form.options.visualCorrection.yes" }));
      const visualCorrectionDioptreInput = screen.getByLabelText("visualCorrectionDioptre");
      await user.clear(visualCorrectionDioptreInput);
      await user.type(visualCorrectionDioptreInput, "-1,5");
      await user.click(screen.getByRole("combobox", { name: "handedness" }));
      await user.click(screen.getByRole("option", { name: handednessUndetermined }));

      const questionsRadios = screen.getAllByRole("radiogroup");
      questionsRadios.forEach(async (question, index) => {
        const answerLabel = index % 2 === 0 ? "form.safetyQuestions.yes" : "form.safetyQuestions.no";
        await user.click(within(question).getByRole("radio", { name: answerLabel }));
      });

      // takes us to the second part of the proband form
      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);

      // click on the checkbox to show contacts form
      const checkbox = await screen.findByRole("checkbox");
      await user.click(checkbox);

      const typedPhone = "123456789";
      await user.type(screen.getByLabelText("phone"), typedPhone);

      const contactsForm = screen.getByRole("form");
      const agreeButton2 = screen.getByRole("button", { name: "form.common.buttons.agree" });

      // ASSERT
      const expectedValues = {
        email: "",
        phone: typedPhone,
      };
      expect(contactsForm).toHaveFormValues(expectedValues);

      await user.click(agreeButton2);
      expect(createProbandVisitFormSpy).not.toHaveBeenCalled();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });
  });
});
