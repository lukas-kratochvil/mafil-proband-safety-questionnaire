import { Box, Typography } from "@mui/material";
import { blue, green, orange, red } from "@mui/material/colors";

export enum ColoredInfoStripeColors {
  BLUE,
  GREEN,
  ORANGE,
  RED,
}

// Colors used from: https://mui.com/material-ui/customization/color/#color-palette
const COLOR_SHADE = 600;

const mapBackgroundColor = (color: ColoredInfoStripeColors): string => {
  switch (color) {
    case ColoredInfoStripeColors.GREEN: {
      return green[COLOR_SHADE];
    }
    case ColoredInfoStripeColors.ORANGE: {
      return orange[COLOR_SHADE];
    }
    case ColoredInfoStripeColors.RED: {
      return red[COLOR_SHADE];
    }
    default: {
      return blue[COLOR_SHADE];
    }
  }
};

export interface IColoredInfoStripeProps {
  text: string;
  color: ColoredInfoStripeColors;
}

export const ColoredInfoStripe = ({ text, color }: IColoredInfoStripeProps) => (
  <Box
    sx={{
      width: "100%",
      paddingTop: "0.45rem",
      paddingBottom: "0.5rem",
      borderRadius: "0.25rem",
      bgcolor: mapBackgroundColor(color),
    }}
  >
    <Typography
      width="100%"
      fontWeight={500}
      color={({ palette }) => palette.common.white}
      textAlign="center"
      textTransform="uppercase"
    >
      {text}
    </Typography>
  </Box>
);
