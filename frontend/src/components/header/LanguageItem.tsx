import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { FlagComponent } from "country-flag-icons/react/3x2";

export interface ILanguageItemProps {
  name: string;
  label: string;
  Flag: FlagComponent;
}

export const LanguageItem = ({
  name,
  label,
  Flag,
}: ILanguageItemProps) => {
  return (
    <Tooltip title={name}>
      <Button size="small">
        <Avatar
          alt={label}
          variant="rounded"
          sx={{
            width: 30,
            height: 25,
            backgroundColor: "inherit"
          }}
        >
          <Flag />
        </Avatar>
      </Button>
    </Tooltip>
  );
};
