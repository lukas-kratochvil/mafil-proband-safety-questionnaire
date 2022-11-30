import userEvent from "@testing-library/user-event";
import { defaultFormSchema } from "@components/form/schemas/form-schema_default";
import { loadEmptyDefaultValues } from "@components/form/util/loaders";
import i18n from "@i18n";
import { IQuestionData, QuestionPartNumber } from "@interfaces/question";
import { render, screen, waitFor, within } from "@test-utils";
import { FormPageContainer } from "../FormPageContainer";
import { ProbandFormPage } from "../ProbandFormPage";

//----------------------------------------------------------------------
// Mocking react-router-dom hooks
//----------------------------------------------------------------------
const mockedUsedNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as Record<string, unknown>),
  useNavigate: () => mockedUsedNavigate,
}));

//----------------------------------------------------------------------
// Mocking custom ErrorFeedback component
//----------------------------------------------------------------------
vi.mock("../../../components/form/ErrorFeedback", () => ({
  ErrorFeedback: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking custom fetch methods
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

vi.mock("../../../util/fetch", async () => ({
  ...((await vi.importActual("../../../util/fetch")) as Record<string, unknown>),
  fetchProjects: async (): Promise<string[]> => ["project1", "project2", "project3"],
  fetchDevices: async (): Promise<string[]> => ["device1", "device2", "device3"],
  fetchCurrentQuestions: async (): Promise<IQuestionData[]> => questionData,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("proband form page", () => {
  const setup = () => {
    render(
      <FormPageContainer
        FormPage={ProbandFormPage}
        validationSchema={defaultFormSchema}
        loadDefaultValues={loadEmptyDefaultValues}
      />
    );
  };

  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
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
        height: "",
        weight: "",
        visualCorrection: "",
        visualCorrectionValue: "0",
        sideDominance: "",
        email: "",
        phoneNumber: "",
      })
    );
    const questions = await screen.findAllByRole("radiogroup");
    expect(questions.length).toEqual(questionData.length);
  });

  test("birthdate and MALE gender is filled automatically from valid personal ID value", async () => {
    setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("personalId"), "9606301232");

    expect(screen.getByLabelText("birthdate")).toHaveValue("30.06.1996");
    expect(screen.getByLabelText("gender")).toHaveValue("form.enums.gender.MALE");
  });

  test("birthdate and FEMALE gender is filled automatically from valid personal ID value", async () => {
    setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("personalId"), "9656301237");

    expect(screen.getByLabelText("birthdate")).toHaveValue("30.06.1996");
    expect(screen.getByLabelText("gender")).toHaveValue("form.enums.gender.FEMALE");
  });

  test("part of personal ID is filled automatically from valid birthdate and MALE gender", async () => {
    setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("birthdate"), "30.06.1996");
    await user.click(screen.getByRole("combobox", { name: "gender" }));
    await user.click(screen.getByRole("option", { name: "form.enums.gender.MALE" }));

    expect(screen.getByLabelText("personalId")).toHaveValue("960630");
  });

  test("part of personal ID is filled automatically from valid birthdate and FEMALE gender", async () => {
    setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("birthdate"), "30.06.1996");
    await user.click(screen.getByRole("combobox", { name: "gender" }));
    await user.click(screen.getByRole("option", { name: "form.enums.gender.FEMALE" }));

    expect(screen.getByLabelText("personalId")).toHaveValue("965630");
  });

  // TODO: this test never finishes.. maybe the second change to the visualCorrection input gets stucked?
  // test("auto-fill 0 for the visual correction value when visual correction is YES", async () => {
  //   setup();
  //   const user = userEvent.setup();
  //   const visualCorrectionInput = screen.getByLabelText("visualCorrection");
  //   const visualCorrectionValueInput = screen.getByLabelText("visualCorrectionValue");

  //   await user.click(visualCorrectionInput);
  //   await user.click(screen.getByRole("option", { name: "form.enums.visualCorrection.YES" }));
  //   await user.clear(visualCorrectionValueInput);
  //   await user.type(visualCorrectionValueInput, "-1,5");
  //   await user.click(visualCorrectionInput);
  //   await user.click(screen.getByRole("option", { name: "form.enums.visualCorrection.NO" }));

  //   expect(visualCorrectionValueInput).toHaveValue("0");
  // });

  test(
    "submits form with all fields filled",
    async () => {
      setup();
      const user = userEvent.setup();

      const typedName = "John";
      await user.type(screen.getByLabelText("name"), typedName);

      const typedSurname = "Wick";
      await user.type(screen.getByLabelText("surname"), typedSurname);

      const typedPersonalId = "9656301237";
      await user.type(screen.getByLabelText("personalId"), typedPersonalId);
      // birthdate is filled automatically
      const expectedBirthdate = "30.06.1996";
      // gender is filled automatically
      const expectedGender = "form.enums.gender.FEMALE";

      await user.click(screen.getByLabelText("nativeLanguage"));
      const selectedNativeLanguage = "Čeština";
      await user.click(screen.getByRole("option", { name: selectedNativeLanguage }));

      const typedHeight = "173";
      await user.type(screen.getByLabelText("height"), typedHeight);

      const typedWeight = "70";
      await user.type(screen.getByLabelText("weight"), typedWeight);

      await user.click(screen.getByLabelText("visualCorrection"));
      const selectedVisualCorrection = "form.enums.visualCorrection.YES";
      await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

      const typedVisualCorrectionValue = "-1,5";
      await user.clear(screen.getByLabelText("visualCorrectionValue"));
      await user.type(screen.getByLabelText("visualCorrectionValue"), typedVisualCorrectionValue);

      await user.click(screen.getByLabelText("sideDominance"));
      const selectedSideDominance = "form.enums.sideDominance.UNDETERMINED";
      await user.click(screen.getByRole("option", { name: selectedSideDominance }));

      const typedEmail = "name.surname@mail.com";
      await user.type(screen.getByLabelText("email"), typedEmail);

      const typedPhoneNumber = "123456789";
      await user.type(screen.getByLabelText("phoneNumber"), typedPhoneNumber);

      const expectedFormValues = {
        name: typedName,
        surname: typedSurname,
        personalId: typedPersonalId,
        birthdate: expectedBirthdate,
        gender: expectedGender,
        nativeLanguage: selectedNativeLanguage,
        height: typedHeight,
        weight: typedWeight,
        visualCorrection: selectedVisualCorrection,
        visualCorrectionValue: typedVisualCorrectionValue,
        sideDominance: selectedSideDominance,
        email: typedEmail,
        phoneNumber: typedPhoneNumber,
      };
      expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues);

      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });

      await user.click(agreeButton);
      // TODO: change this to check calling POST method that will create a visit
      expect(mockedUsedNavigate).toHaveBeenCalledTimes(0);

      const questions = screen.getAllByRole("radiogroup");
      questions.forEach(async (question, index) => {
        const answerLabel = index % 2 === 0 ? "form.safetyQuestions.yes" : "form.safetyQuestions.no";
        await user.click(within(question).getByRole("radio", { name: answerLabel }));
      });

      await user.click(agreeButton);
      // TODO: change this to check calling POST method that will create a visit
      expect(mockedUsedNavigate).toHaveBeenCalledOnce();
    },
    {
      timeout: 10000,
    }
  );

  test(
    "submits form without proband contact fields filled",
    async () => {
      setup();
      const user = userEvent.setup();

      const typedName = "John";
      await user.type(screen.getByLabelText("name"), typedName);

      const typedSurname = "Wick";
      await user.type(screen.getByLabelText("surname"), typedSurname);

      const typedPersonalId = "9656301237";
      await user.type(screen.getByLabelText("personalId"), typedPersonalId);
      // birthdate is filled automatically
      const expectedBirthdate = "30.06.1996";
      // gender is filled automatically
      const expectedGender = "form.enums.gender.FEMALE";

      await user.click(screen.getByLabelText("nativeLanguage"));
      const selectedNativeLanguage = "Čeština";
      await user.click(screen.getByRole("option", { name: selectedNativeLanguage }));

      const typedHeight = "173";
      await user.type(screen.getByLabelText("height"), typedHeight);

      const typedWeight = "70";
      await user.type(screen.getByLabelText("weight"), typedWeight);

      await user.click(screen.getByLabelText("visualCorrection"));
      const selectedVisualCorrection = "form.enums.visualCorrection.YES";
      await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

      const typedVisualCorrectionValue = "-1,5";
      await user.clear(screen.getByLabelText("visualCorrectionValue"));
      await user.type(screen.getByLabelText("visualCorrectionValue"), typedVisualCorrectionValue);

      await user.click(screen.getByLabelText("sideDominance"));
      const selectedSideDominance = "form.enums.sideDominance.UNDETERMINED";
      await user.click(screen.getByRole("option", { name: selectedSideDominance }));

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
        height: typedHeight,
        weight: typedWeight,
        visualCorrection: selectedVisualCorrection,
        visualCorrectionValue: typedVisualCorrectionValue,
        sideDominance: selectedSideDominance,
        email: "",
        phoneNumber: "",
      };
      expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues);

      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);
      // TODO: change this to check calling POST method that will create a visit
      expect(mockedUsedNavigate).toHaveBeenCalledOnce();
    },
    {
      timeout: 10000,
    }
  );

  test(
    "does not submit when email filled and phone number not",
    async () => {
      setup();
      const user = userEvent.setup();

      const typedName = "John";
      await user.type(screen.getByLabelText("name"), typedName);

      const typedSurname = "Wick";
      await user.type(screen.getByLabelText("surname"), typedSurname);

      const typedPersonalId = "9656301237";
      await user.type(screen.getByLabelText("personalId"), typedPersonalId);
      // birthdate is filled automatically
      const expectedBirthdate = "30.06.1996";
      // gender is filled automatically
      const expectedGender = "form.enums.gender.FEMALE";

      await user.click(screen.getByLabelText("nativeLanguage"));
      const selectedNativeLanguage = "Čeština";
      await user.click(screen.getByRole("option", { name: selectedNativeLanguage }));

      const typedHeight = "173";
      await user.type(screen.getByLabelText("height"), typedHeight);

      const typedWeight = "70";
      await user.type(screen.getByLabelText("weight"), typedWeight);

      await user.click(screen.getByLabelText("visualCorrection"));
      const selectedVisualCorrection = "form.enums.visualCorrection.YES";
      await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

      const typedVisualCorrectionValue = "-1,5";
      await user.clear(screen.getByLabelText("visualCorrectionValue"));
      await user.type(screen.getByLabelText("visualCorrectionValue"), typedVisualCorrectionValue);

      await user.click(screen.getByLabelText("sideDominance"));
      const selectedSideDominance = "form.enums.sideDominance.UNDETERMINED";
      await user.click(screen.getByRole("option", { name: selectedSideDominance }));

      const typedEmail = "name.surname@mail.com";
      await user.type(screen.getByLabelText("email"), typedEmail);

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
        height: typedHeight,
        weight: typedWeight,
        visualCorrection: selectedVisualCorrection,
        visualCorrectionValue: typedVisualCorrectionValue,
        sideDominance: selectedSideDominance,
        email: typedEmail,
        phoneNumber: "",
      };
      expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues);

      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);
      // TODO: change this to check calling POST method that will create a visit
      expect(mockedUsedNavigate).toHaveBeenCalledTimes(0);
    },
    {
      timeout: 10000,
    }
  );

  test(
    "does not submit when phone number filled and email not",
    async () => {
      setup();
      const user = userEvent.setup();

      const typedName = "John";
      await user.type(screen.getByLabelText("name"), typedName);

      const typedSurname = "Wick";
      await user.type(screen.getByLabelText("surname"), typedSurname);

      const typedPersonalId = "9656301237";
      await user.type(screen.getByLabelText("personalId"), typedPersonalId);
      // birthdate is filled automatically
      const expectedBirthdate = "30.06.1996";
      // gender is filled automatically
      const expectedGender = "form.enums.gender.FEMALE";

      await user.click(screen.getByLabelText("nativeLanguage"));
      const selectedNativeLanguage = "Čeština";
      await user.click(screen.getByRole("option", { name: selectedNativeLanguage }));

      const typedHeight = "173";
      await user.type(screen.getByLabelText("height"), typedHeight);

      const typedWeight = "70";
      await user.type(screen.getByLabelText("weight"), typedWeight);

      await user.click(screen.getByLabelText("visualCorrection"));
      const selectedVisualCorrection = "form.enums.visualCorrection.YES";
      await user.click(screen.getByRole("option", { name: selectedVisualCorrection }));

      const typedVisualCorrectionValue = "-1,5";
      await user.clear(screen.getByLabelText("visualCorrectionValue"));
      await user.type(screen.getByLabelText("visualCorrectionValue"), typedVisualCorrectionValue);

      await user.click(screen.getByLabelText("sideDominance"));
      const selectedSideDominance = "form.enums.sideDominance.UNDETERMINED";
      await user.click(screen.getByRole("option", { name: selectedSideDominance }));

      const typedPhoneNumber = "123456789";
      await user.type(screen.getByLabelText("phoneNumber"), typedPhoneNumber);

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
        height: typedHeight,
        weight: typedWeight,
        visualCorrection: selectedVisualCorrection,
        visualCorrectionValue: typedVisualCorrectionValue,
        sideDominance: selectedSideDominance,
        email: "",
        phoneNumber: typedPhoneNumber,
      };
      expect(screen.getByRole("form")).toHaveFormValues(expectedFormValues);

      const agreeButton = screen.getByRole("button", { name: "form.common.buttons.agree" });
      await user.click(agreeButton);
      // TODO: change this to check calling POST method that will create a visit
      expect(mockedUsedNavigate).toHaveBeenCalledTimes(0);
    },
    {
      timeout: 10000,
    }
  );
});
