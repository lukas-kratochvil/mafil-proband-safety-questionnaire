import { Alert, AlertColor, Button, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  visitId: string | undefined,
  visitState: VisitState,
  setVisitState: React.Dispatch<React.SetStateAction<VisitState>>
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
  const [visitState, setVisitState] = useState<VisitState>(visit.state);
  const [coloredInfoStripe, setColoredInfoStripe] = useState<IColoredInfoStripeProps>(getColoredInfoStripe(visitState));
  const [buttons, setButtons] = useState<IButtonProps[]>(getButtons(id, visitState, setVisitState));

  useEffect(() => {
    setColoredInfoStripe(getColoredInfoStripe(visitState));
    setButtons(getButtons(id, visitState, setVisitState));
  }, [id, visitState]);

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
