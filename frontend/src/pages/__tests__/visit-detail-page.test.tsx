import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@test-utils";
import i18n from "src/i18n";
import { Gender, IVisit, SideDominance, VisitState, VisualCorrection } from "src/interfaces/visit";
import * as fetchers from "../../util/fetch";
import { VisitDetailPage } from "../VisitDetailPage";

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
    sideDominance: SideDominance.UNDETERMINED,
    visualCorrection: VisualCorrection.NO,
    visualCorrectionValue: 0,
    email: "",
    phoneNumber: "",
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
// Tests
//----------------------------------------------------------------------
describe("visit detail page", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("cimode");
  });

  test("contains translations", async () => {
    const { container } = render(<VisitDetailPage />);

    await waitFor(() => expect(container).toHaveTextContent(/visitDetailPage.title: /));
  });

  test("is disapproved", async () => {
    const disapprovedVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.DISAPPROVED,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => disapprovedVisit);

    const { container } = render(<VisitDetailPage />);
    const iframe = screen.getByTitle("Visit detail");
    const backButton = await screen.findByText(/common.backButton/);

    expect(iframe).toBeInTheDocument();
    expect(container).toHaveTextContent(/visitDetailPage.title: /);
    await waitFor(() => expect(container).toHaveTextContent(disapprovedVisit.visitId));
    await waitFor(() => expect(container).toHaveTextContent(/visitDetailPage.infoStripes.disapproved/));
    expect(backButton).toBeInTheDocument();
  });

  test("is approved", async () => {
    const approvedVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.APPROVED,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => approvedVisit);

    const { container } = render(<VisitDetailPage />);
    const iframe = screen.getByTitle("Visit detail");
    const downloadPDFAndPhysicallySignButton = await screen.findByText(
      /visitDetailPage.buttons.downloadPDFAndPhysicallySign/
    );
    const signElectronicallyButton = await screen.findByText(/visitDetailPage.buttons.signElectronically/);
    const backButton = await screen.findByText(/common.backButton/);

    expect(iframe).toBeInTheDocument();
    expect(container).toHaveTextContent(/visitDetailPage.title: /);
    await waitFor(() => expect(container).toHaveTextContent(approvedVisit.visitId));
    await waitFor(() => expect(container).toHaveTextContent(/visitDetailPage.infoStripes.signatureChoice/));
    expect(downloadPDFAndPhysicallySignButton).toBeInTheDocument();
    expect(signElectronicallyButton).toBeDisabled();
    expect(backButton).toBeInTheDocument();
  });

  test("is for signature", async () => {
    const forSignatureVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.FOR_SIGNATURE,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => forSignatureVisit);

    const { container } = render(<VisitDetailPage />);
    const iframe = screen.getByTitle("Visit detail");
    const confirmSignatureButton = await screen.findByText(/visitDetailPage.buttons.confirmSignature/);
    const backButton = await screen.findByText(/common.backButton/);

    expect(iframe).toBeInTheDocument();
    expect(container).toHaveTextContent(/visitDetailPage.title: /);
    await waitFor(() => expect(container).toHaveTextContent(forSignatureVisit.visitId));
    await waitFor(() =>
      expect(container).toHaveTextContent(/visitDetailPage.infoStripes.waitingForSignatureConfirmation/)
    );
    expect(confirmSignatureButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test("is signed", async () => {
    const signedVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.SIGNED,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => signedVisit);

    const { container } = render(<VisitDetailPage />);
    const iframe = screen.getByTitle("Visit detail");
    const downloadPDFButton = await screen.findByText(/visitDetailPage.buttons.downloadPDF/);
    const backButton = await screen.findByText(/common.backButton/);

    expect(iframe).toBeInTheDocument();
    expect(container).toHaveTextContent(/visitDetailPage.title: /);
    await waitFor(() => expect(container).toHaveTextContent(signedVisit.visitId));
    await waitFor(() => expect(container).toHaveTextContent(/visitDetailPage.infoStripes.signed/));
    expect(downloadPDFButton).toBeInTheDocument();
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

    const { container } = render(<VisitDetailPage />);
    const iframe = screen.getByTitle("Visit detail");
    const downloadPDFButton = await screen.findByText(/visitDetailPage.buttons.downloadPDF/);
    const backButton = await screen.findByText(/common.backButton/);

    expect(iframe).toBeInTheDocument();
    expect(container).toHaveTextContent(/visitDetailPage.title: /);
    await waitFor(() => expect(container).toHaveTextContent(signedPhantomVisit.visitId));
    await waitFor(() => expect(container).toHaveTextContent(/visitDetailPage.infoStripes.completed/));
    expect(downloadPDFButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test("switches from approved to for-signature state", async () => {
    const approvedVisit: IVisit = {
      ...defaultVisit,
      state: VisitState.APPROVED,
    };
    vi.spyOn(fetchers, "fetchVisitDetail").mockImplementationOnce(async () => approvedVisit);

    render(<VisitDetailPage />);
    const downloadPDFAndPhysicallySignButton = await screen.findByText(
      /visitDetailPage.buttons.downloadPDFAndPhysicallySign/
    );
    await userEvent.click(downloadPDFAndPhysicallySignButton);

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

    render(<VisitDetailPage />);
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

    render(<VisitDetailPage />);
    const confirmSignatureButton = await screen.findByText(/visitDetailPage.buttons.confirmSignature/);
    await userEvent.click(confirmSignatureButton);

    expect(await screen.findByText(/visitDetailPage.infoStripes.completed/)).toBeInTheDocument();
    expect(await screen.findByText(/visitDetailPage.buttons.downloadPDF/)).toBeInTheDocument();
    expect(await screen.findByText(/common.backButton/)).toBeInTheDocument();
  });
});
