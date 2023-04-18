import i18n from "@app/i18n";
import { IVisitDetail } from "@app/model/visit";
import VisitDetailPage from "@app/pages/VisitDetailPage";
import { PDF_CONTENT } from "@app/util/mafildb_API/data.dev";
import { VisitState } from "@app/util/mafildb_API/dto";
import * as mafildbFetchers from "@app/util/mafildb_API/fetch";
import { render, screen } from "@test-utils";

//----------------------------------------------------------------------
// Default visit detail
//----------------------------------------------------------------------
const id = "ID1";
const defaultVisit: IVisitDetail = {
  visitId: "VisitId1",
  state: VisitState.APPROVED,
  isPhantom: false,
  pdfContent: PDF_CONTENT,
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
    vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => defaultVisit);
    setup();

    await screen.findByText(/visitDetailPage.title: /);
  });

  test("is disapproved", async () => {
    const disapprovedVisit: IVisitDetail = {
      ...defaultVisit,
      state: VisitState.DISAPPROVED,
    };
    vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => disapprovedVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${disapprovedVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.disapproved/);
    const iframe = await screen.findByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("is approved", async () => {
    const approvedVisit: IVisitDetail = {
      ...defaultVisit,
      state: VisitState.APPROVED,
    };
    vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => approvedVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${approvedVisit.visitId}`)).toBeDefined();
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

  test("is for signature physically", async () => {
    const forSignatureVisit: IVisitDetail = {
      ...defaultVisit,
      state: VisitState.FOR_SIGNATURE_PHYSICALLY,
    };
    vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => forSignatureVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${forSignatureVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.waitingForSignatureConfirmation/);
    const iframe = screen.getByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const confirmSignatureButton = await screen.findByText(/visitDetailPage.buttons.confirmSignature/);
    expect(confirmSignatureButton).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("is for signature electronically", async () => {
    const forSignatureVisit: IVisitDetail = {
      ...defaultVisit,
      state: VisitState.FOR_SIGNATURE_ELECTRONICALLY,
    };
    vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => forSignatureVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${forSignatureVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.waitingForSignatureConfirmation/);
    const iframe = screen.getByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const confirmSignatureButton = await screen.findByText(/visitDetailPage.buttons.confirmSignature/);
    expect(confirmSignatureButton).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("is signed physically", async () => {
    const signedVisit: IVisitDetail = {
      ...defaultVisit,
      state: VisitState.SIGNED_PHYSICALLY,
    };
    vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => signedVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${signedVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.signed/);
    const iframe = screen.getByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const downloadPDFButton = await screen.findByText(/visitDetailPage.buttons.downloadPDF/);
    expect(downloadPDFButton).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("is signed electronically", async () => {
    const signedVisit: IVisitDetail = {
      ...defaultVisit,
      state: VisitState.SIGNED_ELECTRONICALLY,
    };
    vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => signedVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${signedVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.signed/);
    const iframe = screen.getByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const downloadPDFButton = await screen.findByText(/visitDetailPage.buttons.downloadPDF/);
    expect(downloadPDFButton).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  test("is phantom done", async () => {
    const signedPhantomVisit: IVisitDetail = {
      ...defaultVisit,
      state: VisitState.PHANTOM_DONE,
      isPhantom: true,
    };
    vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => signedPhantomVisit);
    setup();

    expect(await screen.findByText(`visitDetailPage.title: ${signedPhantomVisit.visitId}`)).toBeDefined();
    await screen.findByText(/visitDetailPage.infoStripes.completed/);
    const iframe = screen.getByTitle("Visit detail");
    expect(iframe).toBeInTheDocument();
    const downloadPDFButton = await screen.findByText(/visitDetailPage.buttons.downloadPDF/);
    expect(downloadPDFButton).toBeInTheDocument();
    const backButton = await screen.findByText(/common.backButton/);
    expect(backButton).toBeInTheDocument();
  });

  // TODO: repair these tests that switch visit detail state
  // test("switches from approved to for-signature state", async () => {
  //   const approvedVisit: IVisitDetail = {
  //     ...defaultVisit,
  //     state: VisitState.APPROVED,
  //   };
  //   vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => approvedVisit);
  //   setup();
  //   const user = userEvent.setup();

  //   const downloadPDFAndPhysicallySignButton = await screen.findByText(
  //     /visitDetailPage.buttons.downloadPDFAndPhysicallySign/
  //   );
  //   await user.click(downloadPDFAndPhysicallySignButton);

  //   expect(await screen.findByText(/visitDetailPage.infoStripes.waitingForSignatureConfirmation/)).toBeInTheDocument();
  //   expect(await screen.findByText(/visitDetailPage.buttons.confirmSignature/)).toBeInTheDocument();
  //   expect(await screen.findByText(/common.backButton/)).toBeInTheDocument();
  // });

  // test("switches from for-signature to signed state", async () => {
  //   const forSignatureVisit: IVisitDetail = {
  //     ...defaultVisit,
  //     state: VisitState.FOR_SIGNATURE_PHYSICALLY,
  //   };
  //   vi.spyOn(mafildbFetchers, "fetchVisitDetail").mockImplementationOnce(async () => forSignatureVisit);
  //   setup();

  //   const confirmSignatureButton = await screen.findByText(/visitDetailPage.buttons.confirmSignature/);
  //   await userEvent.click(confirmSignatureButton);

  //   expect(await screen.findByText(/visitDetailPage.infoStripes.signed/)).toBeInTheDocument();
  //   expect(await screen.findByText(/visitDetailPage.buttons.downloadPDF/)).toBeInTheDocument();
  //   expect(await screen.findByText(/common.backButton/)).toBeInTheDocument();
  // });
});
