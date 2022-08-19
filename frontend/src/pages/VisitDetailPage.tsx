import { Button, Grid, Stack } from "@mui/material";
import { PageTemplate } from "./PageTemplate";
import "../styles/style.css";
import { CardBox } from "../components/card/CardBox";
import { dummyVisit, VisitState } from "../data/visit_data";

const dummyPDF = "/dummy-multipage.pdf";

interface IColoredInfoStripeProps {
  text: string;
  backgroundColor: string;
}

const ColoredInfoStripe = ({ text, backgroundColor }: IColoredInfoStripeProps) => (
  <div style={{ backgroundColor, width: "100%", textAlign: "center", fontSize: "1.5rem" }}>{text}</div>
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
        backgroundColor: "red",
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
        backgroundColor: "orange",
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
        backgroundColor: "green",
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
        backgroundColor: "red",
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
