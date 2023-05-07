//#region Import components
// React components
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Material UI components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

// Common utils and actions
import { getTeamNames, getTeamLeadNames } from "../../actions";

// Child components
import ResourceCountPerSkill from "./ResourceCountPerSkill";
import ProficiencyCountPerSkill from "./ProficiencyCountPerSkill";
import PivotGenerator from "./PivotGenerator";
import Dashboard from "./dashboard/Dashboard";
//#endregion

//#region Tab Panel properties
// Template for Tab contents
function TabPanel(props) {
  // Constants initialization
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// Tab Panel properties
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
//#endregion

// Styling definition for the Grid container
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: "1 !important",
    width: "100% !important",
  },
  appBar: {
    width: "auto !important",
  },
  tab: {
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100 !important",
      width: "100% !important",
    },
    [theme.breakpoints.up("xs")]: {
      margin: "auto !important",
    },
  },
}));

function Reports(props) {
  // Constants initialization
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const {
    profile,
    tmPosition,
    getTeamNames,
    teamNames,
    getTeamLeadNames,
    teamLeadNames,
  } = props;

  // Cusom handle change function
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (profile) {
      getTeamNames();
      getTeamLeadNames();
    }
    // eslint-disable-next-line
  }, [tmPosition]);

  return profile && tmPosition === "admin" ? (
    <Grid
      container
      align="center"
      justifyContent="center"
      className={classes.root}
      spacing={1}
      style={{ marginTop: "85px" }}
    >
      <Grid item xs={9}>
        <AppBar className={classes.appBar} position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            selectionFollowsFocus
          >
            {/* <Tab
              className={`${classes.tab} tab`}
              {...a11yProps(0)}
              label="Resource Count per Skill"
            />
            <Tab
              className={`${classes.tab} tab`}
              {...a11yProps(1)}
              label="Proficiency Count per Skill"
            />
            <Tab
              className={`${classes.tab} tab`}
              {...a11yProps(2)}
              label="Pivot Report"
            /> */}
            <Tab
              className={`${classes.tab} tab`}
              {...a11yProps(0)}
              label="Dashboard"
            />
          </Tabs>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <TabPanel value={value} index={1}>
          <ResourceCountPerSkill
            profile={profile}
            teamNames={teamNames}
            teamLeadNames={teamLeadNames}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ProficiencyCountPerSkill
            profile={profile}
            teamNames={teamNames}
            teamLeadNames={teamLeadNames}
          />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <PivotGenerator profile={profile} />
        </TabPanel>
        <TabPanel value={value} index={0}>
          <Dashboard profile={profile} />
        </TabPanel>
      </Grid>
    </Grid>
  ) : null;
}

const mapStateToProps = (state) => ({
  teamNames: state.teamNames,
  teamLeadNames: state.teamLeadNames,
});

export default connect(mapStateToProps, { getTeamNames, getTeamLeadNames })(
  Reports
);
