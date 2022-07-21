import { Button, Card, Grid, Typography } from "@mui/material";

export const LoginOperator = () => {
  return (
    <Grid
      container
      direction='row'
      justifyContent='center'
      alignItems='center'
    >
      <Typography>
        Přihlášen:
      </Typography>
      <Card
        sx={{
          bgcolor: 'white',
          marginLeft: 1,
          paddingX: 2,
          paddingY: 1,
          maxWidth: 400,
          textAlign: 'center',
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        <Typography noWrap>
          Operator
        </Typography>
      </Card>
      <Button
        sx={{
          marginLeft: 4,
          bgcolor: 'black',
          color: 'white',
          border: 1,
          '&:hover': {
            bgcolor: 'black',
            color: 'pink',
          }
        }}
      >
        Odhlásit se
      </Button>
    </Grid>
  );
}
