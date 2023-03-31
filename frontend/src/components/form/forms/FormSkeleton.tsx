import { Skeleton, Stack } from "@mui/material";
import { useAuthDev } from "@app/hooks/auth/auth-dev";

export const FormSkeleton = () => {
  const { operator } = useAuthDev();

  return (
    <Stack
      spacing="1.5rem"
      sx={{
        // content height is minus header and minus navigation (if viewed in the auth version) and minus PageContainer margin
        height: `calc(100vh - 4rem ${operator === undefined ? "" : "- 3rem"} - 4rem)`,
      }}
    >
      <Skeleton
        variant="rounded"
        animation="wave"
        width="100%"
        height="70%"
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="100%"
        height="100%"
      />
    </Stack>
  );
};
