import { Button, Grid, Skeleton, Stack } from "@mui/material";
import {
  useQuery,
  type QueryObserverResult,
  type RefetchOptions,
  type RefetchQueryFilters,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CardContainer } from "@app/components/card/CardContainer";
import { ColoredInfoStripe, type ColoredInfoStripeProps } from "@app/components/informative/ColoredInfoStripe";
import { ErrorAlert } from "@app/components/informative/ErrorAlert";
import { convertStringToLocalizationKey } from "@app/i18n/i18n";
import type { VisitDetail, VisitDetailPDF } from "@app/model/visit";
import { RoutingPath } from "@app/routing-paths";
import { fetchVisitDetail, updateVisitSignatureState } from "@app/util/mafildb_API/calls";
import { MDB_ApprovalState, MDB_SignatureState } from "@app/util/mafildb_API/dto";
import { handleErrorsWithToast, type ButtonProps } from "@app/util/utils";
import { PageContainer } from "./PageContainer";

type VisitDetailButtonProps = ButtonProps & {
  disabled?: boolean;
};

const getColoredInfoStripe = (visitDetail: VisitDetail): ColoredInfoStripeProps | undefined => {
  if (visitDetail.isPhantom) {
    return {
      textLocalizationKey: "visitDetailPage.infoStripes.completed",
      color: "green",
    };
  }

  switch (visitDetail.approvalState) {
    case MDB_ApprovalState.DISAPPROVED:
      return {
        textLocalizationKey: "visitDetailPage.infoStripes.disapproved",
        color: "red",
      };
    case MDB_ApprovalState.APPROVED:
      switch (visitDetail.signatureState) {
        case MDB_SignatureState.NOT_SET:
          return {
            textLocalizationKey: "visitDetailPage.infoStripes.signatureChoice",
            color: "blue",
          };
        case MDB_SignatureState.FOR_SIGNATURE_PHYSICALLY:
        case MDB_SignatureState.FOR_SIGNATURE_ELECTRONICALLY:
          return {
            textLocalizationKey: "visitDetailPage.infoStripes.waitingForSignatureConfirmation",
            color: "orange",
          };
        case MDB_SignatureState.SIGNED_PHYSICALLY:
        case MDB_SignatureState.SIGNED_ELECTRONICALLY:
          return {
            textLocalizationKey: "visitDetailPage.infoStripes.signed",
            color: "green",
          };
        default:
          return undefined;
      }
    default:
      return undefined;
  }
};

const createBase64EncodedPdfDataUrl = (pdf: VisitDetailPDF) => `data:application/pdf;base64,${pdf.content}`;

const downloadPdf = (pdf: VisitDetailPDF): void => {
  const downloadLink = document.createElement("a");
  downloadLink.href = createBase64EncodedPdfDataUrl(pdf);
  downloadLink.download = pdf.name;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const getButtons = (
  visitDetail: VisitDetail,
  refetchVisitDetail: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<VisitDetail, unknown>>
): VisitDetailButtonProps[] => {
  if (visitDetail.isPhantom) {
    return [
      {
        titleLocalizationKey: "visitDetailPage.buttons.downloadPDF",
        onClick: async () => downloadPdf(visitDetail.pdf),
      },
    ];
  }

  switch (visitDetail.approvalState) {
    case MDB_ApprovalState.DISAPPROVED:
      return [];
    case MDB_ApprovalState.APPROVED:
      switch (visitDetail.signatureState) {
        case MDB_SignatureState.NOT_SET:
          return [
            {
              titleLocalizationKey: "visitDetailPage.buttons.downloadPDFAndPhysicallySign",
              onClick: async () => {
                downloadPdf(visitDetail.pdf);
                await updateVisitSignatureState(visitDetail.uuid, MDB_SignatureState.FOR_SIGNATURE_PHYSICALLY);
                void refetchVisitDetail();
              },
            },
            {
              titleLocalizationKey: "visitDetailPage.buttons.signElectronically",
              onClick: async () => {
                await updateVisitSignatureState(visitDetail.uuid, MDB_SignatureState.FOR_SIGNATURE_ELECTRONICALLY);
              },
              disabled: true,
            },
          ];
        case MDB_SignatureState.FOR_SIGNATURE_PHYSICALLY:
          return [
            {
              titleLocalizationKey: "visitDetailPage.buttons.confirmSignature",
              onClick: async () => {
                await updateVisitSignatureState(visitDetail.uuid, MDB_SignatureState.SIGNED_PHYSICALLY);
                void refetchVisitDetail();
              },
            },
          ];
        case MDB_SignatureState.FOR_SIGNATURE_ELECTRONICALLY:
          return [
            {
              titleLocalizationKey: "visitDetailPage.buttons.confirmSignature",
              onClick: async () => {
                await updateVisitSignatureState(visitDetail.uuid, MDB_SignatureState.SIGNED_ELECTRONICALLY);
                void refetchVisitDetail();
              },
            },
          ];
        case MDB_SignatureState.SIGNED_PHYSICALLY:
        case MDB_SignatureState.SIGNED_ELECTRONICALLY:
          return [
            {
              titleLocalizationKey: "visitDetailPage.buttons.downloadPDF",
              onClick: async () => downloadPdf(visitDetail.pdf),
            },
          ];
        default:
          return [];
      }
    default:
      return [];
  }
};

const VisitDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    data: visitDetail,
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey: ["visit", id], queryFn: () => fetchVisitDetail(id) });
  const navigate = useNavigate();

  const [coloredInfoStripe, setColoredInfoStripe] = useState<ColoredInfoStripeProps>();
  const [buttons, setButtons] = useState<VisitDetailButtonProps[]>();

  useEffect(() => {
    const stateButtons: VisitDetailButtonProps[] = [];

    if (visitDetail !== undefined) {
      setColoredInfoStripe(getColoredInfoStripe(visitDetail));
      stateButtons.push(...getButtons(visitDetail, refetch));
    }

    // can't use back button because when a visit is submitted from a form and then the visit detail is displayed and then the user clicks the back button it redirects back to that form
    stateButtons.push({
      titleLocalizationKey: "common.backButton",
      onClick: async () => navigate(RoutingPath.RECENT_VISITS),
    });
    setButtons(stateButtons);
  }, [navigate, refetch, visitDetail]);

  if (isError) {
    return (
      <PageContainer>
        <ErrorAlert />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton
          variant="rounded"
          animation="wave"
          height="950px"
          width="100%"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <CardContainer title={`${t("visitDetailPage.title")}: ${visitDetail.visitId}`}>
        <Stack
          spacing="1rem"
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          {coloredInfoStripe && <ColoredInfoStripe {...coloredInfoStripe} />}
          <iframe
            src={`${createBase64EncodedPdfDataUrl(visitDetail.pdf)}#view=fitH`}
            title="Visit detail"
            height="770px"
            width="100%"
          />
          {buttons && (
            <Grid
              container
              direction="row"
              justifyContent="center"
              gap="1.5rem"
            >
              {buttons.map((button) => (
                <Button
                  key={button.titleLocalizationKey}
                  variant="contained"
                  onClick={async () => {
                    try {
                      await button.onClick();
                    } catch (error) {
                      handleErrorsWithToast(error, t);
                    }
                  }}
                  disabled={button.disabled}
                >
                  {t(convertStringToLocalizationKey(button.titleLocalizationKey))}
                </Button>
              ))}
            </Grid>
          )}
        </Stack>
      </CardContainer>
    </PageContainer>
  );
};

export default VisitDetailPage;
