import { Card, Divider, Grid, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface IFormCardProps {
  title?: string | undefined;
  mainGridPadding?: number | undefined;
}

export const FormCard = ({ children, title, mainGridPadding: gridPadding = 2 }: PropsWithChildren<IFormCardProps>) => {
  return (
    <Card
      sx={{
        border: 2,
      }}
    >
      {title &&
        <>
          <Typography
            textAlign='center'
            fontWeight='bold'
            fontSize={20}
            paddingY={1}
          >
            {title}
          </Typography>
          <Divider flexItem />
        </>
      }
      <Grid
        container
        sx={{
          padding: gridPadding
        }}
      >
        {children}
      </Grid>
    </Card>
  );
}
