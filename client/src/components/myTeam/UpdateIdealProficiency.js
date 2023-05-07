import { Button, Grid, Paper, Box } from "@material-ui/core";

function UpdateIdealProficiency() {
  let glink =
    "https://docs.google.com/forms/d/e/1FAIpQLSd-CDfes8tFR_ifm49vvnfmleZYq9X9-jpnZD4LYWJaTOrCwA/viewform";
  return (
    <Grid item xs={8}>
      <Paper elevation={8} style={{ marginTop: "20px" }}>
        <Box component="div" p={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.open(glink, "_blank")}
          >
            Go to Google Form
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
}

export default UpdateIdealProficiency;

// https://docs.google.com/forms/d/1bfaTBTunJz6fGWxk1K4P04VmtQqznYl6OgztkroTFu0/edit
