import userEvent from "@testing-library/user-event";
import i18n from "@i18n";
import { Gender, Handedness, IVisit, VisitState, VisualCorrection } from "@interfaces/visit";
import VisitDetailPage from "@pages/VisitDetailPage";
import { render, screen } from "@test-utils";
import * as fetchers from "@util/fetch";

//----------------------------------------------------------------------
// Default visit
//----------------------------------------------------------------------
const id = "ID1";
const defaultVisit: IVisit = {
  id,
  visitId: "VisitId1",
  state: VisitState.NEW,
  createdAt: new Date(),
  pdf: "",
  projectInfo: {
    project: "Project1",
    projectId: "ProjectId1",
    device: "Device1",
    deviceId: "DeviceId1",
    isPhantom: false,
    measurementDate: new Date(),
    disapprovalReason: null,
  },
  probandInfo: {
    name: "Name",
    surname: "Surname",
    personalId: "123456",
    birthdate: new Date(),
    gender: Gender.OTHER,
    height: 179,
    weight: 81,
    nativeLanguage: "English",
    handedness: Handedness.UNDETERMINED,
    visualCorrection: VisualCorrection.NO,
    visualCorrectionValue: 0,
    email: "",
    phone: "",
  },
  answers: [],
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
vi.mock("@components/header/LanguageMenu", () => ({
  LanguageMenu: () => <div />,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("visit detail page", () => {
  const setup = () => {
    render(<VisitDetailPage />);
  };

  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", async () => {
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => defaultVisit);
    setup();

    await screen.findByText(/visitDetailPage.title: /);
  });

  test("is disapproved", async () => {
    const disapprovedVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.DISAPPROVED,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => disapprovedVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${  disapprovedVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.disapproved/);
    const iframe = await screen.findByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("is approved", async () => {
    const approvedVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.APPROVED,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => approvedVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${  approvedVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.signatureChoice/);
    const iframe = screen.getByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const downloadPDFAndPhysicallySignButton = await screen.findByText(
      /visitDetailPage.buttons.downloadPDFAndPhysicallySign/
    );
    expect(downloadPDFAndPhysicallySignButton).toBeInTheDocument();
    const signElectronicallyButton = await screen.findByText(/visitDetailPage.buttons.signElectronically/);
    expect(signElectronicallyButton).toBeDisabled();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("is for signature", async () => {
    const forSignatureVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.FOR_SIGNATURE,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => forSignatureVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${  forSignatureVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.waitingForSignatureConfirmation/);
    const iframe = screen.getByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const confirmSignatureButton = await screen.findByText(/visitDetailPage.buttons.confirmSignature/);
    expect(confirmSignatureButton).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("is signed", async () => {
    const signedVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.SIGNED,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => signedVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${  signedVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.signed/);
    const iframe = screen.getByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const downloadPDFButton = await screen.findByText(/visitDetailPage.buttons.downloadPDF/);
    expect(downloadPDFButton).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("is phantom signed", async () => {
    const signedPhantomVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.SIGNED,
      projectInfo: {
        ...defaultVisit.projectInfo,
        isPhantom: true,
      },
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => signedPhantomVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${  signedPhantomVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.completed/);
    const iframe = screen.getByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const downloadPDFButton = await screen.findByText(/visitDetailPage.buttons.downloadPDF/);
    expect(downloadPDFButton).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("switches from approved to for-signature state", async () => {
    const approvedVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.APPROVED,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => approvedVisit);
    setup();
    const user = userEvent.setup();

    const downloadPDFAndPhysicallySignButton = await screen.findByText(
      /visitDetailPage.buttons.downloadPDFAndPhysicallySign/
    );
    await user.click(downloadPDFAndPhysicallySignButton);

    expect(await screen.findByText(/visitDetailPage.infoStripes.waitingForSignatureConfirmation/)).toBeInTheDocument();
    expect(await screen.findByText(/visitDetailPage.buttons.confirmSignature/)).toBeInTheDocument();
    expect(await screen.findByText(/common.backButton/)).toBeInTheDocument();
  });

  test("switches from for-signature to signed state", async () => {
    const forSignatureVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.FOR_SIGNATURE,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => forSignatureVisit);
    setup();

    const confirmSignatureButton = await screen.findByText(/visitDetailPage.buttons.confirmSignature/);
    await userEvent.click(confirmSignatureButton);

    expect(await screen.findByText(/visitDetailPage.infoStripes.signed/)).toBeInTheDocument();
    expect(await screen.findByText(/visitDetailPage.buttons.downloadPDF/)).toBeInTheDocument();
    expect(await screen.findByText(/common.backButton/)).toBeInTheDocument();
  });

  test("switches phantom from for-signature to signed state", async () => {
    const forSignaturePhantomVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.FOR_SIGNATURE,
      projectInfo: {
        ...defaultVisit.projectInfo,
        isPhantom: true,
      },
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => forSignaturePhantomVisit);
    setup();
    const user = userEvent.setup();

    const confirmSignatureButton = await screen.findByText(/visitDetailPage.buttons.confirmSignature/);
    await user.click(confirmSignatureButton);

    expect(await screen.findByText(/visitDetailPage.infoStripes.completed/)).toBeInTheDocument();
    expect(await screen.findByText(/visitDetailPage.buttons.downloadPDF/)).toBeInTheDocument();
    expect(await screen.findByText(/common.backButton/)).toBeInTheDocument();
  });
});
