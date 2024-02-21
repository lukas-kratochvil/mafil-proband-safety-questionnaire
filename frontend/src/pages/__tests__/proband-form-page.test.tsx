import userEvent from "@testing-library/user-event";
import { gendersTest } from "@app/__tests__/data/genders";
import { handednessesTest } from "@app/__tests__/data/handednesses";
import { nativeLanguagesTest } from "@app/__tests__/data/languages";
import { questionsTest } from "@app/__tests__/data/questions";
import { INativeLanguage } from "@app/model/language";
import ProbandFormPage from "@app/pages/ProbandFormPage";
import { IGenderDTO, IHandednessDTO, IHTMLCardDTO, IOrderedQuestionDTO } from "@app/util/server_API/dto";
import { render, screen, waitFor, within } from "@test-utils";

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
const htmlCard: IHTMLCardDTO = {
  title: "title",
  html: "text only",
};
const newProbandVisitFormId = "id123";

vi.mock("@app/util/server_API/calls", async () => ({
  fetchGenders: async (): Promise<IGenderDTO[]> => gendersTest,
  fetchNativeLanguages: async (): Promise<INativeLanguage[]> => nativeLanguagesTest,
  fetchHandednesses: async (): Promise<IHandednessDTO[]> => handednessesTest,
  fetchCurrentQuestions: async (): Promise<IOrderedQuestionDTO[]> => questionsTest,
  createProbandVisitForm: async (): Promise<string> => newProbandVisitFormId,
  fetchEntryInfo: async (): Promise<IHTMLCardDTO> => htmlCard,
  fetchSafetyInfo: async (): Promise<IHTMLCardDTO> => htmlCard,
  fetchBeforeExamination: async (): Promise<IHTMLCardDTO> => htmlCard,
  fetchExaminationConsent: async (): Promise<IHTMLCardDTO> => htmlCard,
  fetchProbandContactRequest: async (): Promise<IHTMLCardDTO> => htmlCard,
  fetchProbandContactConsent: async (): Promise<IHTMLCardDTO> => htmlCard,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("proband form page", () => {
  const setup = () => {
    render(<ProbandFormPage />);
  };

  // Data
  const genderMan = gendersTest[0].translations[0].text;
  const genderWoman = gendersTest[1].translations[0].text;
  const nativeLanguageCzech = nativeLanguagesTest[0].nativeName;
  const handednessUndetermined = handednessesTest[3].translations[0].text;

  test("contains correct form buttons", async () => {
    setup();
    const buttonNames: string[] = ["form.common.buttons.agree"];

    const buttons = await screen.findAllByRole("button", { name: /^form\.common\.buttons/ });
    expect(buttons.length).toBe(buttonNames.length);
    buttonNames.forEach(async (buttonName, index) => expect(buttons[index].textContent).toBe(buttonName));
  });

  test("renders new form default values", async () => {
    setup();

    await waitFor(async () =>
      expect(screen.getByRole("form")).toHaveFormValues({
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
      })
    );
    const questions = await screen.findAllByRole("radiogroup");
    expect(questions.length).toEqual(questionsTest.length);
  });

  describe("auto-fills", () => {
    test("birthdate and MALE gender is auto-filled from valid personal ID value", async () => {
      setup();
      const user = userEvent.setup();

      await user.type(await screen.findByLabelText("personalId"), "9606301232");

      expect(screen.getByLabelText("birthdate")).toHaveValue("30.06.1996");
      expect(screen.getByLabelText("gender")).toHaveValue(genderMan);
    });

    test("birthdate and FEMALE gender is auto-filled from valid personal ID value", async () => {
      setup();
      const user = userEvent.setup();

      await user.type(await screen.findByLabelText("personalId"), "9656301237");

      expect(screen.getByLabelText("birthdate")).toHaveValue("30.06.1996");
      expect(screen.getByLabelText("gender")).toHaveValue(genderWoman);
    });

    test("part of personal ID is auto-filled from valid birthdate and MALE gender", async () => {
      setup();
      const user = userEvent.setup();

      await user.type(await screen.findByLabelText("birthdate"), "30.06.1996");
      await user.click(screen.getByRole("combobox", { name: "gender" }));
      await user.click(screen.getByRole("option", { name: genderMan }));

      expect(screen.getByLabelText("personalId")).toHaveValue("960630");
    });

    test("part of personal ID is auto-filled from valid birthdate and FEMALE gender", async () => {
      setup();
      const user = userEvent.setup();

      await user.type(await screen.findByLabelText("birthdate"), "30.06.1996");
      await user.click(screen.getByRole("combobox", { name: "gender" }));
      await user.click(screen.getByRole("option", { name: genderWoman }));

      expect(screen.getByLabelText("personalId")).toHaveValue("965630");
    });

    test("auto-fill 0 for the visual correction value when visual correction is YES", async () => {
      setup();
      const user = userEvent.setup();

      const visualCorrectionInput = await screen.findByRole("combobox", { name: "visualCorrection" });
      const visualCorrectionDioptreInput = screen.getByLabelText("visualCorrectionDioptre");

      expect(visualCorrectionDioptreInput).toHaveValue("0");

      await user.click(visualCorrectionInput);
      await user.click(screen.getByRole("option", { name: "form.enums.visualCorrection.YES" }));
      await user.clear(visualCorrectionDioptreInput);
      await user.type(visualCorrectionDioptreInput, "-1,5");
      await user.click(visualCorrectionInput);
      await user.click(screen.getByRole("option", { name: "form.enums.visualCorrection.NO" }));

      expect(visualCorrectionDioptreInput).toHaveValue("0");
    });
  });

  describe("submitting", () => {
    test("submits form with all fields filled", async () => {
      setup();
      const user = userEvent.setup();

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
      const selectedVisualCorrection = "form.enums.visualCorrection.YES";
      await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

      const typedVisualCorrectionDioptre = "-1,5";
      await user.clear(screen.getByLabelText("visualCorrectionDioptre"));
      await user.type(screen.getByLabelText("visualCorrectionDioptre"), typedVisualCorrectionDioptre);

      await user.click(screen.getByRole("combobox", { name: "handedness" }));
      const selectedHandedness = handednessUndetermined;
      await user.click(screen.getByRole("option", { name: selectedHandedness }));

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
      expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues);

      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      // error - questions aren't filled yet
      await user.click(agreeButton);

      const questions = screen.getAllByRole("radiogroup");
      questions.forEach(async (question, index) => {
        const answerLabel = index % 2 === 0 ? "form.safetyQuestions.yes" : "form.safetyQuestions.no";
        await user.click(within(question).getByRole("radio", { name: answerLabel }));
      });

      // should get to the second form page
      await user.click(agreeButton);

      // click on the checkbox to show contacts form
      await user.click(screen.getByRole("checkbox"));

      const typedEmail = "name.surname@mail.com";
      await user.type(screen.getByLabelText("email"), typedEmail);

      const typedPhone = "123456789";
      await user.type(screen.getByLabelText("phone"), typedPhone);

      expect(screen.getByRole("form")).toHaveFormValues({
        email: typedEmail,
        phone: typedPhone,
      });

      const agreeButton2 = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton2);
      // TODO: change this to check calling POST method that will create a visit
      expect(mockedUseNavigate).toHaveBeenCalledOnce();
    });

    test("submits form without proband contact fields filled", async () => {
      setup();
      const user = userEvent.setup();

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
      const selectedVisualCorrection = "form.enums.visualCorrection.YES";
      await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

      const typedVisualCorrectionDioptre = "-1,5";
      await user.clear(screen.getByLabelText("visualCorrectionDioptre"));
      await user.type(screen.getByLabelText("visualCorrectionDioptre"), typedVisualCorrectionDioptre);

      await user.click(screen.getByRole("combobox", { name: "handedness" }));
      const selectedHandedness = handednessUndetermined;
      await user.click(screen.getByRole("option", { name: selectedHandedness }));

      const questions = screen.getAllByRole("radiogroup");
      questions.forEach(async (question, index) => {
        const answerLabel = index % 2 === 0 ? "form.safetyQuestions.yes" : "form.safetyQuestions.no";
        await user.click(within(question).getByRole("radio", { name: answerLabel }));
      });

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
      expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues);

      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);

      const completeButton = screen.getByRole("button", { name: "form.common.buttons.complete" });
      await user.click(completeButton);
      // TODO: change this to check calling POST method that will create a visit
      expect(mockedUseNavigate).toHaveBeenCalledOnce();
    });

    test("does not submit when email filled and phone number not", async () => {
      setup();
      const user = userEvent.setup();

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
      const selectedVisualCorrection = "form.enums.visualCorrection.YES";
      await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

      const typedVisualCorrectionDioptre = "-1,5";
      await user.clear(screen.getByLabelText("visualCorrectionDioptre"));
      await user.type(screen.getByLabelText("visualCorrectionDioptre"), typedVisualCorrectionDioptre);

      await user.click(screen.getByRole("combobox", { name: "handedness" }));
      const selectedHandedness = handednessUndetermined;
      await user.click(screen.getByRole("option", { name: selectedHandedness }));

      const questions = screen.getAllByRole("radiogroup");
      questions.forEach(async (question, index) => {
        const answerLabel = index % 2 === 0 ? "form.safetyQuestions.yes" : "form.safetyQuestions.no";
        await user.click(within(question).getByRole("radio", { name: answerLabel }));
      });

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
      expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues);

      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);

      // click on the checkbox to show contacts form
      await user.click(screen.getByRole("checkbox"));

      const typedEmail = "name.surname@mail.com";
      await user.type(screen.getByLabelText("email"), typedEmail);

      expect(screen.getByRole("form")).toHaveFormValues({
        email: typedEmail,
        phone: "",
      });

      const agreeButton2 = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton2);
      // TODO: change this to check calling POST method that will create a visit
      expect(mockedUseNavigate).toHaveBeenCalledTimes(0);
    });

    test("does not submit when phone number filled and email not", async () => {
      setup();
      const user = userEvent.setup();

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
      const selectedVisualCorrection = "form.enums.visualCorrection.YES";
      await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

      const typedVisualCorrectionDioptre = "-1,5";
      await user.clear(screen.getByLabelText("visualCorrectionDioptre"));
      await user.type(screen.getByLabelText("visualCorrectionDioptre"), typedVisualCorrectionDioptre);

      await user.click(screen.getByRole("combobox", { name: "handedness" }));
      const selectedHandedness = handednessUndetermined;
      await user.click(screen.getByRole("option", { name: selectedHandedness }));

      const questions = screen.getAllByRole("radiogroup");
      questions.forEach(async (question, index) => {
        const answerLabel = index % 2 === 0 ? "form.safetyQuestions.yes" : "form.safetyQuestions.no";
        await user.click(within(question).getByRole("radio", { name: answerLabel }));
      });

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
      expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues);

      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);

      // click on the checkbox to show contacts form
      await user.click(screen.getByRole("checkbox"));

      const typedPhone = "123456789";
      await user.type(screen.getByLabelText("phone"), typedPhone);

      expect(screen.getByRole("form")).toHaveFormValues({
        email: "",
        phone: typedPhone,
      });

      const agreeButton2 = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton2);
      // TODO: change this to check calling POST method that will create a visit
      expect(mockedUseNavigate).toHaveBeenCalledTimes(0);
    });
  });
});
