import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import i18n from "@i18n";
import PhantomFormPage from "@pages/PhantomFormPage";
import { render, screen, waitFor } from "@test-utils";

//----------------------------------------------------------------------
// Mocking react-router-dom hooks
//----------------------------------------------------------------------
const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as Record<string, unknown>),
  useNavigate: () => mockedUseNavigate,
}));

//----------------------------------------------------------------------
// Mocking custom ErrorFeedback component
//----------------------------------------------------------------------
vi.mock("@components/form/inputs/ErrorFeedback", () => ({
  ErrorFeedback: () => <div />,
}));

//----------------------------------------------------------------------
// Mocking custom fetch methods
//----------------------------------------------------------------------
vi.mock("@util/fetch", async () => ({
  ...((await vi.importActual("@util/fetch")) as Record<string, unknown>),
  fetchProjects: async (): Promise<string[]> => ["project1", "project2", "project3"],
  fetchDevices: async (): Promise<string[]> => ["device1", "device2", "device3"],
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

  test("contains correct form buttons", async () => {
    setup();
    const buttonNames: string[] = [
      "form.common.buttons.finalize",
      "form.common.buttons.cancel",
    ];

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
        measurementDate: format(new Date(), "dd.MM.yyyy"),
        name: "",
        surname: "",
        personalId: "",
        birthdate: "",
        gender: "form.enums.gender.OTHER",
        nativeLanguage: "",
        height: "",
        weight: "",
        sideDominance: "",
        visualCorrection: "",
        visualCorrectionValue: "0",
      })
    );
  });

  test("birthdate is filled automatically from valid personal ID value and gender stays the same", async () => {
    setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("personalId"), "9606301232");

    expect(screen.getByLabelText("birthdate")).toHaveValue("30.06.1996");
    expect(screen.getByLabelText("gender")).toHaveValue("form.enums.gender.OTHER");
  });

  test("part of personal ID is filled automatically from valid birthdate", async () => {
    setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("birthdate"), "30.06.1996");

    expect(screen.getByLabelText("personalId")).toHaveValue("960630");
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

  test("submits form", async () => {
    setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole("combobox", { name: "project" }));
    const selectedProject = "project1";
    await user.click(screen.getByRole("option", { name: selectedProject }));

    await user.click(screen.getByLabelText("device"));
    const selectedDevice = "device3";
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

    const expectedFormValues = {
      project: selectedProject,
      device: selectedDevice,
      measurementDate: format(new Date(), "dd.MM.yyyy"),
      name: typedName,
      surname: typedSurname,
      personalId: typedPersonalId,
      birthdate: expectedBirthdate,
      gender: "form.enums.gender.OTHER",
      nativeLanguage: selectedNativeLanguage,
      height: typedHeight,
      weight: typedWeight,
      sideDominance: selectedSideDominance,
      visualCorrection: selectedVisualCorrection,
      visualCorrectionValue: typedVisualCorrectionValue,
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

    await user.click(screen.getByLabelText("project"));
    await user.click(screen.getByRole("option", { name: "project1" }));

    await user.click(screen.getByLabelText("device"));
    await user.click(screen.getByRole("option", { name: "device3" }));

    await user.type(screen.getByLabelText("name"), "John");

    await user.type(screen.getByLabelText("surname"), "Wick");

    // birthdate is filled automatically and gender stays the same
    await user.type(screen.getByLabelText("personalId"), "9606301232");

    await user.click(screen.getByLabelText("nativeLanguage"));
    await user.click(screen.getByRole("option", { name: "Čeština" }));

    await user.type(screen.getByLabelText("height"), "173");

    await user.type(screen.getByLabelText("weight"), "70");

    await user.click(screen.getByLabelText("sideDominance"));
    await user.click(screen.getByRole("option", { name: "form.enums.sideDominance.UNDETERMINED" }));

    const finalizeButton = screen.getByRole("button", { name: "form.common.buttons.finalize" });

    /**
     * Test case: visualCorrection = YES and visualCorrectionValue = 0
     * Expected result: does not submit the form
     */
    await user.click(screen.getByLabelText("visualCorrection"));
    await user.click(screen.getByRole("option", { name: "form.enums.visualCorrection.YES" }));
    await user.click(finalizeButton);
    // TODO: change this to check calling POST method that will create a visit
    expect(mockedUseNavigate).toHaveBeenCalledTimes(0);
    mockedUseNavigate.mockClear();

    /**
     * Test case: visualCorrection = YES and visualCorrectionValue != 0
     * Expected result: submits the form
     */
    await user.clear(screen.getByLabelText("visualCorrectionValue"));
    await user.type(screen.getByLabelText("visualCorrectionValue"), "-1,5");
    await user.click(finalizeButton);
    // TODO: change this to check calling POST method that will create a visit
    expect(mockedUseNavigate).toHaveBeenCalledOnce();
    mockedUseNavigate.mockClear();
  });
});
