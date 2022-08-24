import { Alert, AlertColor, Button, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageTemplate } from "./PageTemplate";
import "../styles/style.css";
import { CardBox } from "../components/card/CardBox";
import { VisitState } from "../data/visit_data";
import { fetchVisit } from "../util/utils";

interface IColoredInfoStripeProps {
  text: string;
  color: AlertColor;
}

const ColoredInfoStripe = ({ text, color }: IColoredInfoStripeProps) => (
  <Alert
    severity="info"
    variant="filled"
    color={color}
    icon={false}
    sx={{
      width: "100%",
      padding: 0,
      "& .MuiAlert-message": {
        width: "100%",
        fontSize: "1rem",
        textAlign: "center",
      },
    }}
  >
    {text.toUpperCase()}
  </Alert>
);

interface IButtonProps {
  title: string;
  onClick: () => void;
}

const getColoredInfoStripe = (visitState?: VisitState): IColoredInfoStripeProps => {
  switch (visitState) {
    case VisitState.NEW:
      return {
        text: "Nepodepsáno",
        color: "error",
      };
    case VisitState.CHECKED:
      return {
        text: "Čeká se na potvrzení podpisu",
        color: "warning",
      };
    case VisitState.SIGNED:
      return {
        text: "Podepsáno",
        color: "success",
      };
    default:
      return {
        text: `ERROR - switch case for the value '${
          visitState === undefined ? "" : VisitState[visitState]
        }' does not exist`,
        color: "error",
      };
  }
};

const getButtons = (
  visitState: VisitState | undefined,
  setVisitState: React.Dispatch<React.SetStateAction<VisitState | undefined>>
): IButtonProps[] => {
  switch (visitState) {
    case VisitState.NEW:
      return [
        {
          title: "Stáhnout PDF a fyzicky podepsat",
          onClick: () => {
            /**
             * TODO:
             *  - PDF will be generated and stored in DB on the server
             *  - open system download window, so the auth user can choose where to store it (or show the print windows instead?)
             */
            setVisitState(VisitState.CHECKED);
          },
        },
        {
          title: "Podepsat elektronicky",
          onClick: () => {
            // TODO: PDF will be generated and stored in DB on the server
            setVisitState(VisitState.CHECKED);
          },
        },
      ];
    case VisitState.CHECKED:
      return [
        {
          title: "Potvrdit podpis",
          onClick: () => {
            // TODO: store the state in DB
            setVisitState(VisitState.SIGNED);
          },
        },
      ];
    case VisitState.SIGNED:
      return [
        {
          title: "Stáhnout PDF",
          onClick: () => {
            // TODO: open system download window, so the auth user can choose where to store it (or show the print windows instead?)
            console.log("TODO");
          },
        },
      ];
    default:
      return [];
  }
};

export const VisitDetailPage = () => {
  const { id } = useParams();
  const visit = id === undefined ? undefined : fetchVisit(id);

  const [visitState, setVisitState] = useState<VisitState | undefined>(visit?.state);
  const [coloredInfoStripe, setColoredInfoStripe] = useState<IColoredInfoStripeProps>(getColoredInfoStripe(visitState));
  const [buttons, setButtons] = useState<IButtonProps[]>(getButtons(visitState, setVisitState));

  useEffect(() => {
    setColoredInfoStripe(getColoredInfoStripe(visitState));
    setButtons(getButtons(visitState, setVisitState));
  }, [id, visitState]);

  return (
    <PageTemplate>
      <CardBox title={`Detail visity s visitId: ${visit?.visitId}`}>
        <Stack
          spacing="1rem"
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          <Stack
            spacing="0.5rem"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <ColoredInfoStripe {...coloredInfoStripe} />
            {visit?.projectInfo.isFantom && (
              <ColoredInfoStripe
                color="info"
                text="Fantom se nepodepisuje"
              />
            )}
          </Stack>
          <iframe
            className="visit-pdf"
            src={`${visit?.pdf}#view=fitH`}
            title="Visit detail"
          />
          <Grid
            container
            direction="row"
            justifyContent="center"
            gap="1.5rem"
          >
            {buttons.map((button, index) => (
              <Button
                variant="contained"
                onClick={button.onClick}
                key={index}
              >
                {button.title}
              </Button>
            ))}
          </Grid>
        </Stack>
      </CardBox>
    </PageTemplate>
  );
};
