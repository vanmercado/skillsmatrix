import { createTheme } from "@material-ui/core";

const colorTelusPurple = "#4B286D";
const colorTelusGreen = "#66CC00";
// const colorAccessibleGreen = "#2B8000";
// const colorWhite = "#FFFFFF";
const colorGreyAthens = "#F7F7F8";
const colorCardinal = "#C12335";

export default createTheme({
  palette: {
    common: {
      colorTelusPurple: `${colorTelusPurple}`,
      colorTelusGreen: `${colorTelusGreen}`,
    },
    primary: {
      main: `${colorTelusPurple}`,
    },
    secondary: {
      main: `${colorTelusGreen}`,
    },
    warning: {
      main: `${colorCardinal}`,
    },
    background: {
      default: `${colorGreyAthens}`,
    },
  },
  typography: {
    fontSize: 13,
  },
});
