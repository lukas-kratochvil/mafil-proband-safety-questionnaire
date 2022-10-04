import { Button, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardBox } from "../components/card/CardBox";
import {
  ColoredInfoStripe,
  ColoredInfoStripeColors,
  IColoredInfoStripeProps,
} from "../components/informative/ColoredInfoStripe";
import { IVisit, VisitState } from "../data/visit_data";
import { fetchVisitDetail } from "../util/fetch";
import { PageTemplate } from "./PageTemplate";

interface IButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

const getColoredInfoStripe = (
  visitState: VisitState | undefined,
  visit: IVisit | undefined
): IColoredInfoStripeProps => {
  switch (visitState) {
    case VisitState.NEW:
      return {
        text: "Nezkontrolováno",
        color: ColoredInfoStripeColors.RED,
      };
    case VisitState.APPROVED:
      return {
        text: "Výběr způsobu podepsání visity",
        color: ColoredInfoStripeColors.BLUE,
      };
    case VisitState.FOR_SIGNATURE:
      return {
        text: "Čeká se na potvrzení podpisu",
        color: ColoredInfoStripeColors.ORANGE,
      };
    case VisitState.SIGNED:
      return {
        text: visit?.projectInfo.isFantom ? "Fantom se nepodepisuje" : "Podepsáno",
        color: visit?.projectInfo.isFantom ? ColoredInfoStripeColors.BLUE : ColoredInfoStripeColors.GREEN,
      };
    default:
      return {
        text: `ERROR - switch case for the value '${
          visitState === undefined ? "" : VisitState[visitState]
        }' does not exist`,
        color: ColoredInfoStripeColors.RED,
      };
  }
};

const getButtons = (
  visitState: VisitState | undefined,
  setVisitState: React.Dispatch<React.SetStateAction<VisitState | undefined>>
): IButtonProps[] => {
  switch (visitState) {
    case VisitState.APPROVED:
      return [
        {
          title: "Stáhnout PDF a fyzicky podepsat",
          onClick: () => {
            /**
             * TODO:
             *  - PDF will be generated and stored in DB on the server
             *  - open system download window, so the auth user can choose where to store it (or show the print windows instead?)
             *  - check my Firefox bookmarks for some interesting websites!!!
             */
            setVisitState(VisitState.FOR_SIGNATURE);
          },
        },
        {
          title: "Podepsat elektronicky",
          onClick: () => {
            // TODO: PDF will be generated and stored in DB on the server
            setVisitState(VisitState.FOR_SIGNATURE);
          },
          disabled: true,
        },
      ];
    case VisitState.FOR_SIGNATURE:
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
            alert("Funkcionalita bude brzy naimplementována.");
          },
        },
      ];
    default:
      return [];
  }
};

export const VisitDetailPage = () => {
  const { id } = useParams();
  const [visit, setVisit] = useState<IVisit>();
  const [isLoading, setIsLoading] = useState<boolean>(true); // TODO: use MUI Skeleton while data is fetching
  const [isError, setIsError] = useState<boolean>(false); // TODO: create ErrorPage

  const [visitState, setVisitState] = useState<VisitState>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const fetchedVisit = await fetchVisitDetail(id);

        if (fetchedVisit === undefined) {
          setIsError(true);
        } else {
          setVisit(fetchedVisit);
          setVisitState(fetchedVisit.state);
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

    setColoredInfoStripe(getColoredInfoStripe(visitState, visit));
    setButtons(getButtons(visitState, setVisitState));
  }, [visit, visitState]);

  return (
    <PageTemplate>
      <CardBox title={`Detail visity: ${visit?.visitId}`}>
        <Stack
          spacing="1rem"
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          {coloredInfoStripe && <ColoredInfoStripe {...coloredInfoStripe} />}
          {/* TODO: set width of <iframe> so that there's not so much space on the sides - depends on the generated PDF width */}
          <iframe
            src={`${visit?.pdf}#view=fitH`}
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
