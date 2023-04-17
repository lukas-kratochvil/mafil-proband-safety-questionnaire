import { Button, Grid, Skeleton, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
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
import { VisitState } from "@app/util/mafildb_API/dto";
import { fetchVisitDetail, updateVisitState } from "@app/util/mafildb_API/fetch";
import { getBackButtonProps, IButtonProps } from "@app/util/utils";
import { PageContainer } from "./PageContainer";

interface IVisitDetailButtonProps extends IButtonProps {
  disabled?: boolean;
}

const getColoredInfoStripe = (visitState: VisitState | undefined): IColoredInfoStripeProps | undefined => {
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
    case VisitState.FOR_SIGNATURE_PHYSICALLY || VisitState.FOR_SIGNATURE_ELECTRONICALLY:
      return {
        textLocalizationKey: "visitDetailPage.infoStripes.waitingForSignatureConfirmation",
        color: ColoredInfoStripeColors.ORANGE,
      };
    case VisitState.SIGNED_PHYSICALLY || VisitState.SIGNED_ELECTRONICALLY:
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

const getButtons = (visitId: string | undefined, visitState: VisitState | undefined): IVisitDetailButtonProps[] => {
  switch (visitState) {
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
            await updateVisitState(visitId, VisitState.FOR_SIGNATURE_PHYSICALLY);
          },
        },
        {
          titleLocalizationKey: "visitDetailPage.buttons.signElectronically",
          onClick: async () => {
            // TODO: PDF will be generated and stored in DB on the server
            await updateVisitState(visitId, VisitState.FOR_SIGNATURE_ELECTRONICALLY);
          },
          disabled: true,
        },
      ];
    case VisitState.FOR_SIGNATURE_PHYSICALLY:
      return [
        {
          titleLocalizationKey: "visitDetailPage.buttons.confirmSignature",
          onClick: async () => {
            // TODO: store the state in DB
            await updateVisitState(visitId, VisitState.SIGNED_PHYSICALLY);
          },
        },
      ];
    case VisitState.FOR_SIGNATURE_ELECTRONICALLY:
      return [
        {
          titleLocalizationKey: "visitDetailPage.buttons.confirmSignature",
          onClick: async () => {
            // TODO: store the state in DB
            await updateVisitState(visitId, VisitState.SIGNED_ELECTRONICALLY);
          },
        },
      ];
    case VisitState.SIGNED_PHYSICALLY || VisitState.SIGNED_ELECTRONICALLY || VisitState.PHANTOM_DONE:
      return [
        {
          titleLocalizationKey: "visitDetailPage.buttons.downloadPDF",
          onClick: () => {
            // TODO: open system download window, so the auth user can choose where to store it (or show the print windows instead?)
            alert("Funkcionalita bude brzy naimplementována.");
          },
        },
      ];
    default:
      return [];
  }
};

const VisitDetailPage = () => {
  const { t } = useTranslation(defaultNS);
  const { id } = useParams();
  const {
    data: visit,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["visit", id], queryFn: () => fetchVisitDetail(id) });
  const navigate = useNavigate();

  const [coloredInfoStripe, setColoredInfoStripe] = useState<IColoredInfoStripeProps>();
  const [buttons, setButtons] = useState<IVisitDetailButtonProps[]>();

  useEffect(() => {
    setColoredInfoStripe(getColoredInfoStripe(visit?.state));
    const stateButtons = getButtons(visit?.visitId, visit?.state);
    stateButtons.push(getBackButtonProps(navigate));
    setButtons(stateButtons);
  }, [navigate, visit]);

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
      <CardContainer title={`${t("visitDetailPage.title")}: ${visit?.visitId}`}>
        <Stack
          spacing="1rem"
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          {coloredInfoStripe && <ColoredInfoStripe {...coloredInfoStripe} />}
          {/* TODO: set width of <iframe> so that there's not so much space on the sides - depends on the generated PDF width */}
          <iframe
            src={`${visit?.pdfContent}#view=fitH`}
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
