import {
  CircularProgress,
  TextField,
  useMediaQuery,
  type AutocompleteRenderInputParams,
  type Theme,
} from "@mui/material";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

type FormAutocompleteInputFieldProps = {
  name: string;
  isLoading: boolean;
  field: Pick<ControllerRenderProps<FieldValues, string>, "name" | "ref">;
  params: AutocompleteRenderInputParams;
};

export const FormAutocompleteInputField = ({ name, isLoading, field, params }: FormAutocompleteInputFieldProps) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <TextField
      {...params}
      inputRef={field.ref}
      name={field.name}
      size={matchesDownSmBreakpoint ? "small" : "medium"}
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {isLoading && (
              <CircularProgress
                color="inherit"
                size={20}
              />
            )}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
      inputProps={{
        ...params.inputProps,
        "aria-label": name,
      }}
    />
  );
};
