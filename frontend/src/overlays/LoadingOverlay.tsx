import { Backdrop, CircularProgress } from "@mui/material";

type LoadingOverlayProps = {
  isOpen: boolean;
};

export const LoadingOverlay = ({ isOpen }: LoadingOverlayProps) => (
  <Backdrop
    open={isOpen}
    sx={{
      color: "#fff",
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    }}
  >
    <CircularProgress />
  </Backdrop>
);
