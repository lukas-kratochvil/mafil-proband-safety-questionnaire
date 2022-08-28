import { Button, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardBox } from "../components/card/CardBox";
import { ColoredInfoStripe, IColoredInfoStripeProps } from "../components/informative/ColoredInfoStripe";
import { IProbandVisit, VisitState } from "../data/visit_data";
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
    case VisitState.FANTOM_NEW: // TODO: remove this, only for the testing purpose
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
  const [visit, setVisit] = useState<IProbandVisit>();
  const [isLoading, setIsLoading] = useState<boolean>(true); // TODO: use MUI Skeleton while data is fetching
  const [isError, setIsError] = useState<boolean>(false); // TODO: create ErrorPage

  const [visitState, setVisitState] = useState<VisitState>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await fetchVisit(id);

        if (response === undefined) {
          setIsError(true);
        } else {
          setVisit(response);
          setVisitState(response.state);
          setIsLoading(false);
        }
      } catch (e) {
        setIsError(true);
      }
    };

    fetch();
  }, [id]);

  const [coloredInfoStripe, setColoredInfoStripe] = useState<IColoredInfoStripeProps>();
  const [buttons, setButtons] = useState<IButtonProps[]>();

  useEffect(() => {
    if (visit !== undefined && visitState !== undefined) {
      visit.state = visitState;
    }

    setColoredInfoStripe(getColoredInfoStripe(visitState));
    setButtons(getButtons(visitState, setVisitState));
  }, [visit, visitState]);

  return (
    <PageTemplate>
      <CardBox title={`Detail visity s visitId: ${visit?.visitId}`}>
        <Stack
          spacing="1rem"
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          {coloredInfoStripe && <ColoredInfoStripe {...coloredInfoStripe} />}
          <iframe
            className="visit-pdf"
            src={`${visit?.pdf}#view=fitH`}
            title="Visit detail"
          />
          {buttons && (
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
          )}
        </Stack>
      </CardBox>
    </PageTemplate>
  );
};
