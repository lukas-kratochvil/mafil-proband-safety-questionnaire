import { Button, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardBox } from "../components/card/CardBox";
import { ColoredInfoStripe, IColoredInfoStripeProps } from "../components/feedback/ColoredInfoStripe";
import { VisitState } from "../data/visit_data";
import "../styles/style.css";
import { fetchVisit } from "../util/utils";
import { PageTemplate } from "./PageTemplate";

interface IButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
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
    case VisitState.FANTOM_DONE:
      return {
        text: "Fantom se nepodepisuje",
        color: "info",
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
          disabled: true,
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
    case VisitState.FANTOM_DONE:
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
          <ColoredInfoStripe {...coloredInfoStripe} />
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
                disabled={button.disabled}
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
