import { Button, Grid, Skeleton, Stack } from "@mui/material";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CardContainer } from "@app/components/card/CardContainer";
import {
  ColoredInfoStripe,
  ColoredInfoStripeColors,
  IColoredInfoStripeProps,
} from "@app/components/informative/ColoredInfoStripe";
import { ErrorAlert } from "@app/components/informative/ErrorAlert";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n";
import { IVisitDetail } from "@app/model/visit";
import { fetchVisitDetail, updateVisitState } from "@app/util/mafildb_API/calls";
import { VisitState } from "@app/util/mafildb_API/dto";
import { getBackButtonProps, IButtonProps } from "@app/util/utils";
import { PageContainer } from "./PageContainer";

const getVisitDetailQueryKey = (visitId: string | undefined) => ["visit", visitId];

interface IVisitDetailButtonProps extends IButtonProps {
  disabled?: boolean;
}

const getColoredInfoStripe = (visitState: VisitState): IColoredInfoStripeProps | undefined => {
  switch (visitState) {
    case VisitState.APPROVED:
      return {
        textLocalizationKey: "visitDetailPage.infoStripes.signatureChoice",
        color: ColoredInfoStripeColors.BLUE,
      };
    case VisitState.DISAPPROVED:
      return {
        textLocalizationKey: "visitDetailPage.infoStripes.disapproved",
        color: ColoredInfoStripeColors.RED,
      };
    case VisitState.FOR_SIGNATURE_PHYSICALLY:
    case VisitState.FOR_SIGNATURE_ELECTRONICALLY:
      return {
        textLocalizationKey: "visitDetailPage.infoStripes.waitingForSignatureConfirmation",
        color: ColoredInfoStripeColors.ORANGE,
      };
    case VisitState.SIGNED_PHYSICALLY:
    case VisitState.SIGNED_ELECTRONICALLY:
      return {
        textLocalizationKey: "visitDetailPage.infoStripes.signed",
        color: ColoredInfoStripeColors.GREEN,
      };
    case VisitState.PHANTOM_DONE:
      return {
        textLocalizationKey: "visitDetailPage.infoStripes.completed",
        color: ColoredInfoStripeColors.GREEN,
      };
    default:
      return undefined;
  }
};

const createBase64EncodedPdfDataUrl = (base64PdfContent: string) => `data:application/pdf;base64,${base64PdfContent}`;

const downloadPdf = (pdfName: string, base64PdfContent: string): void => {
  const downloadLink = document.createElement("a");
  downloadLink.href = createBase64EncodedPdfDataUrl(base64PdfContent);
  downloadLink.download = pdfName;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const getButtons = (queryClient: QueryClient, visitDetail: IVisitDetail): IVisitDetailButtonProps[] => {
  switch (visitDetail.state) {
    case VisitState.APPROVED:
      return [
        {
          titleLocalizationKey: "visitDetailPage.buttons.downloadPDFAndPhysicallySign",
          onClick: async () => {
            /**
             * TODO:
             *  - PDF will be generated and stored in DB on the server
             *  - open system download window, so the auth user can choose where to store it (or show the print windows instead?)
             *  - check my Firefox bookmarks for some interesting websites!!!
             */
            downloadPdf(visitDetail.pdfName, visitDetail.pdfContent);
            await updateVisitState(visitDetail.visitId, VisitState.FOR_SIGNATURE_PHYSICALLY);
            queryClient.invalidateQueries({ queryKey: getVisitDetailQueryKey(visitDetail.visitId), exact: true });
          },
        },
        {
          titleLocalizationKey: "visitDetailPage.buttons.signElectronically",
          onClick: async () => {
            await updateVisitState(visitDetail.visitId, VisitState.FOR_SIGNATURE_ELECTRONICALLY);
          },
          disabled: true,
        },
      ];
    case VisitState.FOR_SIGNATURE_PHYSICALLY:
      return [
        {
          titleLocalizationKey: "visitDetailPage.buttons.confirmSignature",
          onClick: async () => {
            await updateVisitState(visitDetail.visitId, VisitState.SIGNED_PHYSICALLY);
            queryClient.invalidateQueries({ queryKey: getVisitDetailQueryKey(visitDetail.visitId), exact: true });
          },
        },
      ];
    case VisitState.FOR_SIGNATURE_ELECTRONICALLY:
      return [
        {
          titleLocalizationKey: "visitDetailPage.buttons.confirmSignature",
          onClick: async () => {
            await updateVisitState(visitDetail.visitId, VisitState.SIGNED_ELECTRONICALLY);
            queryClient.invalidateQueries({ queryKey: getVisitDetailQueryKey(visitDetail.visitId), exact: true });
          },
        },
      ];
    case VisitState.SIGNED_PHYSICALLY:
    case VisitState.SIGNED_ELECTRONICALLY:
    case VisitState.PHANTOM_DONE:
      return [
        {
          titleLocalizationKey: "visitDetailPage.buttons.downloadPDF",
          onClick: () => downloadPdf(visitDetail.pdfName, visitDetail.pdfContent),
        },
      ];
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
      setColoredInfoStripe(getColoredInfoStripe(visitDetail.state));
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
            src={`${createBase64EncodedPdfDataUrl(visitDetail.pdfContent)}#view=fitH`}
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
                  onClick={button.onClick}
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
