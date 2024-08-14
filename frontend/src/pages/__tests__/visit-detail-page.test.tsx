import { userEvent } from "@testing-library/user-event";
import type { VisitDetail } from "@app/model/visit";
import VisitDetailPage from "@app/pages/VisitDetailPage";
import * as mafildbCalls from "@app/util/mafildb_API/calls";
import { PDF_CONTENT } from "@app/util/mafildb_API/data.dev";
import { MDB_ApprovalState, MDB_SignatureState } from "@app/util/mafildb_API/dto";
import type { OperatorDTO } from "@app/util/server_API/dto";
import { operatorMRTest } from "@test/data/operators";
import { render, screen } from "@test/utils";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const id = "ID1";
const defaultVisit: VisitDetail = {
  uuid: "1",
  visitId: "VisitId1",
  isPhantom: false,
  approvalState: MDB_ApprovalState.APPROVED,
  signatureState: MDB_SignatureState.NOT_SET,
  pdf: {
    name: "pdf_name",
    content: PDF_CONTENT,
  },
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
// Mocking custom authentication
//----------------------------------------------------------------------
vi.mock("@app/hooks/auth/auth", () => ({
  useAuth: () => ({
    operator: operatorMRTest,
  }),
}));

//----------------------------------------------------------------------
// Mocking server API calls
//----------------------------------------------------------------------
vi.mock("@app/util/server_API/calls", async () => ({
  fetchOperator: async (): Promise<OperatorDTO> => operatorMRTest,
}));

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("visit detail page", () => {
  const setup = () => {
    render(<VisitDetailPage />);
  };

  test("contains translations", async () => {
    // ARRANGE
    vi.spyOn(mafildbCalls, "fetchVisitDetail").mockImplementationOnce(async () => defaultVisit);

    // ACT
    setup();

    // ASSERT
    await screen.findByText(/visitDetailPage.title: /);
  });

  test("is disapproved", async () => {
    // ARRANGE
    const disapprovedVisit: VisitDetail = {
      ...defaultVisit,
      approvalState: MDB_ApprovalState.DISAPPROVED,
    };
    vi.spyOn(mafildbCalls, "fetchVisitDetail").mockImplementationOnce(async () => disapprovedVisit);

    // ACT
    setup();
    const visitTitle = await screen.findByText(`visitDetailPage.title: ${disapprovedVisit.visitId}`);
    const infoStripe = await screen.findByText("visitDetailPage.infoStripes.disapproved");
    const iframe = screen.getByTitle("Visit detail");
    const backButton = screen.getByText("common.backButton");

    // ASSERT
    expect(visitTitle).toBeInTheDocument();
    expect(infoStripe).toBeInTheDocument();
    expect(iframe).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test("is approved", async () => {
    // ARRANGE
    const user = userEvent.setup();
    const updateVisitSignatureStateSpy = vi.spyOn(mafildbCalls, "updateVisitSignatureState");
    const approvedVisit: VisitDetail = {
      ...defaultVisit,
      approvalState: MDB_ApprovalState.APPROVED,
    };
    vi.spyOn(mafildbCalls, "fetchVisitDetail").mockImplementationOnce(async () => approvedVisit);

    // ACT
    setup();
    const visitTitle = await screen.findByText(`visitDetailPage.title: ${approvedVisit.visitId}`);
    const infoStripe = await screen.findByText("visitDetailPage.infoStripes.signatureChoice");
    const iframe = screen.getByTitle("Visit detail");
    const downloadPDFAndPhysicallySignButton = screen.getByText("visitDetailPage.buttons.downloadPDFAndPhysicallySign");
    const signElectronicallyButton = screen.getByText("visitDetailPage.buttons.signElectronically");
    const backButton = screen.getByText("common.backButton");

    // ASSERT
    expect(visitTitle).toBeInTheDocument();
    expect(infoStripe).toBeInTheDocument();
    expect(iframe).toBeInTheDocument();
    expect(downloadPDFAndPhysicallySignButton).toBeInTheDocument();
    expect(signElectronicallyButton).toBeDisabled();
    expect(backButton).toBeInTheDocument();

    // this is a bit hacky workaround to not print JSDOM error message when clicking on 'downloadPDFAndPhysicallySignButton': "Error: Not implemented: navigation (except hash changes)"
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    vi.spyOn(console, "error").mockImplementationOnce(() => {});
    await user.click(downloadPDFAndPhysicallySignButton);
    expect(updateVisitSignatureStateSpy).toHaveBeenCalledWith(
      approvedVisit.uuid,
      MDB_SignatureState.FOR_SIGNATURE_PHYSICALLY
    );
  });

  test("is for signature physically", async () => {
    // ARRANGE
    const user = userEvent.setup();
    const updateVisitSignatureStateSpy = vi.spyOn(mafildbCalls, "updateVisitSignatureState");
    const forSignatureVisit: VisitDetail = {
      ...defaultVisit,
      signatureState: MDB_SignatureState.FOR_SIGNATURE_PHYSICALLY,
    };
    vi.spyOn(mafildbCalls, "fetchVisitDetail").mockImplementationOnce(async () => forSignatureVisit);

    // ACT
    setup();
    const visitTitle = await screen.findByText(`visitDetailPage.title: ${forSignatureVisit.visitId}`);
    const infoStripe = await screen.findByText("visitDetailPage.infoStripes.waitingForSignatureConfirmation");
    const iframe = screen.getByTitle("Visit detail");
    const confirmSignatureButton = screen.getByText("visitDetailPage.buttons.confirmSignature");
    const backButton = screen.getByText("common.backButton");

    // ASSERT
    expect(visitTitle).toBeInTheDocument();
    expect(infoStripe).toBeInTheDocument();
    expect(iframe).toBeInTheDocument();
    expect(confirmSignatureButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();

    await user.click(confirmSignatureButton);
    expect(updateVisitSignatureStateSpy).toHaveBeenCalledWith(
      forSignatureVisit.uuid,
      MDB_SignatureState.SIGNED_PHYSICALLY
    );
  });

  test("is for signature electronically", async () => {
    // ARRANGE
    const forSignatureVisit: VisitDetail = {
      ...defaultVisit,
      signatureState: MDB_SignatureState.FOR_SIGNATURE_ELECTRONICALLY,
    };
    vi.spyOn(mafildbCalls, "fetchVisitDetail").mockImplementationOnce(async () => forSignatureVisit);

    // ACT
    setup();
    const visitTitle = await screen.findByText(`visitDetailPage.title: ${forSignatureVisit.visitId}`);
    const infoStripe = await screen.findByText("visitDetailPage.infoStripes.waitingForSignatureConfirmation");
    const iframe = screen.getByTitle("Visit detail");
    const confirmSignatureButton = screen.getByText("visitDetailPage.buttons.confirmSignature");
    const backButton = screen.getByText("common.backButton");

    // ASSERT
    expect(visitTitle).toBeInTheDocument();
    expect(infoStripe).toBeInTheDocument();
    expect(iframe).toBeInTheDocument();
    expect(confirmSignatureButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test("is signed physically", async () => {
    // ARRANGE
    const signedVisit: VisitDetail = {
      ...defaultVisit,
      signatureState: MDB_SignatureState.SIGNED_PHYSICALLY,
    };
    vi.spyOn(mafildbCalls, "fetchVisitDetail").mockImplementationOnce(async () => signedVisit);

    // ACT
    setup();
    const visitTitle = await screen.findByText(`visitDetailPage.title: ${signedVisit.visitId}`);
    const infoStripe = await screen.findByText("visitDetailPage.infoStripes.signed");
    const iframe = screen.getByTitle("Visit detail");
    const downloadPDFButton = screen.getByText("visitDetailPage.buttons.downloadPDF");
    const backButton = screen.getByText("common.backButton");

    // ASSERT
    expect(visitTitle).toBeInTheDocument();
    expect(infoStripe).toBeInTheDocument();
    expect(iframe).toBeInTheDocument();
    expect(downloadPDFButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test("is signed electronically", async () => {
    // ARRANGE
    const signedVisit: VisitDetail = {
      ...defaultVisit,
      signatureState: MDB_SignatureState.SIGNED_ELECTRONICALLY,
    };
    vi.spyOn(mafildbCalls, "fetchVisitDetail").mockImplementationOnce(async () => signedVisit);

    // ACT
    setup();
    const visitTitle = await screen.findByText(`visitDetailPage.title: ${signedVisit.visitId}`);
    const infoStripe = await screen.findByText("visitDetailPage.infoStripes.signed");
    const iframe = screen.getByTitle("Visit detail");
    const downloadPDFButton = screen.getByText("visitDetailPage.buttons.downloadPDF");
    const backButton = screen.getByText("common.backButton");

    // ASSERT
    expect(visitTitle).toBeInTheDocument();
    expect(infoStripe).toBeInTheDocument();
    expect(iframe).toBeInTheDocument();
    expect(downloadPDFButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test("is phantom done", async () => {
    // ARRANGE
    const signedPhantomVisit: VisitDetail = {
      ...defaultVisit,
      isPhantom: true,
    };
    vi.spyOn(mafildbCalls, "fetchVisitDetail").mockImplementationOnce(async () => signedPhantomVisit);

    // ACT
    setup();
    const visitTitle = await screen.findByText(`visitDetailPage.title: ${signedPhantomVisit.visitId}`);
    const infoStripe = await screen.findByText("visitDetailPage.infoStripes.completed");
    const iframe = screen.getByTitle("Visit detail");
    const downloadPDFButton = screen.getByText("visitDetailPage.buttons.downloadPDF");
    const backButton = screen.getByText("common.backButton");

    // ASSERT
    expect(visitTitle).toBeInTheDocument();
    expect(infoStripe).toBeInTheDocument();
    expect(iframe).toBeInTheDocument();
    expect(downloadPDFButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });
});
