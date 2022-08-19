import { Stack } from "@mui/material";
import { PageTemplate } from "./PageTemplate";
import "../styles/style.css";
import { CardBox } from "../components/card/CardBox";

const dummyPDF = "/dummy-multipage.pdf";

export const VisitDetailPage = () => (
  <PageTemplate>
    <CardBox title="Detail visity {visitID}">
      <Stack
        spacing="1rem"
        justifyContent="center"
        alignItems="center"
        padding="1rem"
      >
        <iframe
          className="visit-pdf"
          src={`${dummyPDF}#view=fitH`}
          title="Visit detail"
        />
      </Stack>
    </CardBox>
  </PageTemplate>
);
