import { Button, Grid, Skeleton, Stack } from "@mui/material";
import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CardContainer } from "@app/components/card/CardContainer";
import {
  ColoredInfoStripe,
  ColoredInfoStripeColors,
  type IColoredInfoStripeProps,
} from "@app/components/informative/ColoredInfoStripe";
import { ErrorAlert } from "@app/components/informative/ErrorAlert";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n/i18n";
import type { IVisitDetail, IVisitDetailPDF } from "@app/model/visit";
import { fetchVisitDetail, updateVisitSignatureState } from "@app/util/mafildb_API/calls";
import { MDB_ApprovalState, MDB_SignatureState } from "@app/util/mafildb_API/dto";
import { getBackButtonProps, handleErrorsWithToast, type IButtonProps } from "@app/util/utils";
import { PageContainer } from "./PageContainer";

const getVisitDetailQueryKey = (visitId: string | undefined) => ["visit", visitId];

type IVisitDetailButtonProps = IButtonProps & {
  disabled?: boolean;
};

const getColoredInfoStripe = (visitDetail: IVisitDetail): IColoredInfoStripeProps | undefined => {
  if (visitDetail.isPhantom) {
    return {
      textLocalizationKey: "visitDetailPage.infoStripes.completed",
      color: ColoredInfoStripeColors.GREEN,
    };
  }

  switch (visitDetail.approvalState) {
    case MDB_ApprovalState.DISAPPROVED:
      return {
        textLocalizationKey: "visitDetailPage.infoStripes.disapproved",
        color: ColoredInfoStripeColors.RED,
      };
    case MDB_ApprovalState.APPROVED:
      switch (visitDetail.signatureState) {
        case MDB_SignatureState.NOT_SET:
          return {
            textLocalizationKey: "visitDetailPage.infoStripes.signatureChoice",
            color: ColoredInfoStripeColors.BLUE,
          };
        case MDB_SignatureState.FOR_SIGNATURE_PHYSICALLY:
        case MDB_SignatureState.FOR_SIGNATURE_ELECTRONICALLY:
          return {
            textLocalizationKey: "visitDetailPage.infoStripes.waitingForSignatureConfirmation",
            color: ColoredInfoStripeColors.ORANGE,
          };
        case MDB_SignatureState.SIGNED_PHYSICALLY:
        case MDB_SignatureState.SIGNED_ELECTRONICALLY:
          return {
            textLocalizationKey: "visitDetailPage.infoStripes.signed",
            color: ColoredInfoStripeColors.GREEN,
          };
        default:
          return undefined;
      }
    default:
      return undefined;
  }
};

const createBase64EncodedPdfDataUrl = (pdf: IVisitDetailPDF) => `data:application/pdf;base64,${pdf.content}`;

const downloadPdf = (pdf: IVisitDetailPDF): void => {
  const downloadLink = document.createElement("a");
  downloadLink.href = createBase64EncodedPdfDataUrl(pdf);
  downloadLink.download = pdf.name;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const getButtons = (queryClient: QueryClient, visitDetail: IVisitDetail): IVisitDetailButtonProps[] => {
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
                void queryClient.invalidateQueries({
                  queryKey: getVisitDetailQueryKey(visitDetail.visitId),
                  exact: true,
                });
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
                void queryClient.invalidateQueries({
                  queryKey: getVisitDetailQueryKey(visitDetail.visitId),
                  exact: true,
                });
              },
            },
          ];
        case MDB_SignatureState.FOR_SIGNATURE_ELECTRONICALLY:
          return [
            {
              titleLocalizationKey: "visitDetailPage.buttons.confirmSignature",
              onClick: async () => {
                await updateVisitSignatureState(visitDetail.uuid, MDB_SignatureState.SIGNED_ELECTRONICALLY);
                void queryClient.invalidateQueries({
                  queryKey: getVisitDetailQueryKey(visitDetail.visitId),
                  exact: true,
                });
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
  const { t } = useTranslation(defaultNS);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const {
    data: visitDetail,
    isLoading,
    isError,
  } = useQuery({ queryKey: getVisitDetailQueryKey(id), queryFn: () => fetchVisitDetail(id) });
  const navigate = useNavigate();

  const [coloredInfoStripe, setColoredInfoStripe] = useState<IColoredInfoStripeProps>();
  const [buttons, setButtons] = useState<IVisitDetailButtonProps[]>();

  useEffect(() => {
    const stateButtons: IVisitDetailButtonProps[] = [];

    if (visitDetail !== undefined) {
      setColoredInfoStripe(getColoredInfoStripe(visitDetail));
      stateButtons.push(...getButtons(queryClient, visitDetail));
    }

    stateButtons.push(getBackButtonProps(navigate));
    setButtons(stateButtons);
  }, [queryClient, navigate, visitDetail]);

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
