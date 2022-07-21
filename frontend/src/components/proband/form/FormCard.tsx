import { Card } from "@mui/material";
import { PropsWithChildren } from "react";

export const FormCard = ({ children }: PropsWithChildren) => {
  return (
    <Card
      sx={{
        border: 2,
      }}
    >
      {children}
    </Card>
  );
}
