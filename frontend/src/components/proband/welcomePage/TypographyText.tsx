import { Typography } from "@mui/material";

interface ITypographyTextProps {
  text: string;
}

export const TypographyText = ({ text }: ITypographyTextProps) => {
  return (
    <Typography
      align="center"
      fontWeight='bold'
      fontSize={20}
    >
      {text}
    </Typography>
  )
};
