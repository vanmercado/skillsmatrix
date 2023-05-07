import React, { useState } from "react";

import {
  Grid,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Box,
  makeStyles,
} from "@material-ui/core";

import SkillsDashboard from "./SkillsDashboard";
import ActiveUsersDashboard from "./ActiveUsersDashboard";
import TMSkillStatusDashboard from "./TMSkillStatusDashboard";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "200px",
  },
  contentSpacing: {
    marginTop: "50px",
  },
}));
export default function Dashboard() {
  const classes = useStyles();
  const [dashboardOption, setDashboardOption] = useState("activeUsers");

  const handleDashboardOption = (event) => {
    setDashboardOption(event.target.value);
  };

  let displayDashboard = [];
  if (dashboardOption === "activeUsers") {
    displayDashboard = <ActiveUsersDashboard />;
  } else if (dashboardOption === "skills") {
    displayDashboard = <SkillsDashboard />;
  } else {
    displayDashboard = <TMSkillStatusDashboard />;
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel id="select-label">Select</InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={dashboardOption}
              onChange={handleDashboardOption}
            >
              <MenuItem value={"activeUsers"}>Active Users</MenuItem>
              <MenuItem value={"skills"}>Skills</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box m={3}>{displayDashboard}</Box>
      {/* <Box m={3}>
        <TabContext value={dashboardOption}>
            <Grid container align="center"
            justifyContent="center">
              <Grid item >
                  <Tabs spacing={2} onChange={handleDashboardOption} aria-label="Dashboard List" buttonStyle={{ width: '200px' }}>
                    <Tab label="Active User" value={"activeUsers"}/>
                    <Tab label="Skills" value={"skills"}/>
                  </Tabs>
              </Grid>
            </Grid>
          <TabPanel value="activeUsers"><LoginDashboard/></TabPanel>
          <TabPanel value="skills"><SkillsDashboard/></TabPanel>
        </TabContext>
      </Box> */}
    </>
  );
}
