import { Alert, AlertColor, Button, Grid, Stack } from "@mui/material";
import { PageTemplate } from "./PageTemplate";
import "../styles/style.css";
import { CardBox } from "../components/card/CardBox";
import { dummyVisit, VisitState } from "../data/visit_data";

const dummyPDF = "/dummy-multipage.pdf";

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
      ".MuiAlert-message": {
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

export const VisitDetailPage = () => {
  const visit = dummyVisit;
  let coloredInfoStripe: IColoredInfoStripeProps;
  let buttons: IButtonProps[];

  switch (visit.state) {
    case VisitState.NEW:
      coloredInfoStripe = {
        text: "Nepodepsáno",
        color: "error",
      };
      buttons = [
        {
          title: "Stáhnout PDF a fyzicky podepsat",
          onClick: () => console.log("TODO"),
        },
        {
          title: "Podepsat elektronicky",
          onClick: () => console.log("TODO"),
        },
      ];
      break;
    case VisitState.CHECKED:
      coloredInfoStripe = {
        text: "Čeká se na potvrzení podpisu",
        color: "warning",
      };
      buttons = [
        {
          title: "Potvrdit podpis",
          onClick: () => console.log("TODO"),
        },
      ];
      break;
    case VisitState.SIGNED:
      coloredInfoStripe = {
        text: "Podepsáno",
        color: "success",
      };
      buttons = [
        {
          title: "St8hnout PDF",
          onClick: () => console.log("TODO"),
        },
      ];
      break;
    default:
      coloredInfoStripe = {
        text: `ERROR - switch case for the value '${VisitState[visit.state]}' does not exist`,
        color: "error",
      };
      buttons = [];
      break;
  }

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
