import { Box, Typography } from "@mui/material";
import { blue, green, orange, red } from "@mui/material/colors";
import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey } from "@app/i18n/i18n";

type StripeColor = "blue" | "green" | "orange" | "red";

// Colors used from: https://mui.com/material-ui/customization/color/#color-palette
const COLOR_SHADE = 600;

const mapBackgroundColor = (color: StripeColor): string => {
  switch (color) {
    case "green":
      return green[COLOR_SHADE];
    case "orange":
      return orange[COLOR_SHADE];
    case "red":
      return red[COLOR_SHADE];
    default:
      return blue[COLOR_SHADE];
  }
};

export type ColoredInfoStripeProps = {
  textLocalizationKey: string;
  color: StripeColor;
};

export const ColoredInfoStripe = ({ textLocalizationKey, color }: ColoredInfoStripeProps) => {
  const { t } = useTranslation();

  return (
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
        {t(convertStringToLocalizationKey(textLocalizationKey))}
      </Typography>
    </Box>
  );
};
