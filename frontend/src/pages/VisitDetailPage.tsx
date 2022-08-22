import { Alert, AlertColor, Button, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { PageTemplate } from "./PageTemplate";
import "../styles/style.css";
import { CardBox } from "../components/card/CardBox";
import { dummyVisit, VisitState } from "../data/visit_data";

const dummyPDF = "/dummy-multipage.pdf";
const visit = dummyVisit;

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

const getColoredInfoStripe = (visitState: VisitState): IColoredInfoStripeProps => {
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
        text: `ERROR - switch case for the value '${VisitState[visit.state]}' does not exist`,
        color: "error",
      };
  }
};

const getButtons = (
  visitState: VisitState,
  setVisitState: React.Dispatch<React.SetStateAction<VisitState>>
): IButtonProps[] => {
  switch (visitState) {
    case VisitState.NEW:
      return [
        {
          title: "Stáhnout PDF a fyzicky podepsat",
          onClick: () => setVisitState(VisitState.CHECKED), // TODO: store in DB
        },
        {
          title: "Podepsat elektronicky",
          onClick: () => setVisitState(VisitState.CHECKED), // TODO: store in DB
        },
      ];
    case VisitState.CHECKED:
      return [
        {
          title: "Potvrdit podpis",
          onClick: () => setVisitState(VisitState.SIGNED), // TODO: store in DB
        },
      ];
    case VisitState.SIGNED:
      return [
        {
          title: "Stáhnout PDF",
          onClick: () => console.log("TODO"),
        },
      ];
    default:
      return [];
  }
};

export const VisitDetailPage = () => {
  const [visitState, setVisitState] = useState<VisitState>(visit.state);
  const [coloredInfoStripe, setColoredInfoStripe] = useState<IColoredInfoStripeProps>(getColoredInfoStripe(visitState));
  const [buttons, setButtons] = useState<IButtonProps[]>(getButtons(visitState, setVisitState));

  useEffect(() => {
    setColoredInfoStripe(getColoredInfoStripe(visitState));
    setButtons(getButtons(visitState, setVisitState));
  }, [visitState]);

  return (
    <PageTemplate>
      <CardBox title={`Detail visity ${visit.visitId}`}>
        <Stack
          spacing="1rem"
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          <ColoredInfoStripe {...coloredInfoStripe} />
          <iframe
            className="visit-pdf"
            src={`${dummyPDF}#view=fitH`}
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
