//#region Import components
// React components
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

// React Wrapper for ChartJS
import { Bar } from "react-chartjs-2";

// Material UI components
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

// Common utils and actions
import ExportChart from "../../utils/ExportChart";
import { getTeams, getResourceCountPerSkill } from "../../actions";
//#endregion

const rootContainerId = "widget-container";

// Chart options definition
const chartOptions = {
  options: {
    tooltips: {
      mode: "index",
      intersect: false,
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true,
          beginAtZero: true,
          scaleLabel: {
            labelString: "Skills",
          },
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          beginAtZero: true,
          scaleLabel: {
            labelString: "Resource",
          },
          ticks: {
            stepSize: 1,
            min: 0,
            beginAtZero: true,
          },
        },
      ],
    },
  },
};

function ResourceCountPerSkill(props) {
  // De-construction of props
  const {
    profile,
    getTeams,
    teams,
    getResourceCountPerSkill,
    resourceCountPerSkill,
  } = props;
  const [selectedTeam, setSelectedTeam] = useState("");
  var teamListOptions = [];

  // Placeholders for the extracted labels and values
  var label_contents = [],
    data_contents = [];

  useEffect(() => {
    if (profile) getTeams();
    if (selectedTeam) getResourceCountPerSkill({ teamId: selectedTeam });
    else getResourceCountPerSkill({ teamId: null });
    // eslint-disable-next-line
  }, [selectedTeam]);

  if (resourceCountPerSkill) {
    // Iterate for each index
    Array.from(resourceCountPerSkill).forEach(function (resourceCountPerSkill) {
      label_contents.push(resourceCountPerSkill.skill_desc);
      data_contents.push(resourceCountPerSkill.skill_count);
    });
  }

  // If Teams from state has contents
  if (teams != null && teams.length > 0) {
    // Iterate for each index
    Array.from(teams).forEach((item) => {
      // Customize the options for the Autocomplete field
      // eg. 855 - TELUS TSBT - D&S JAVA Shared Pool (Dickenson Culala)
      teamListOptions.push(
        item.team_id + " - " + item.team_name + " (" + item.manager_name + ")"
      );
    });
  }

  // Chart data definition
  const chartData = {
    labels: label_contents,
    datasets: [
      {
        label: "Resource per Skill",
        backgroundColor: "rgba(0, 207, 255,0.5)",
        borderColor: "rgba(0, 207, 255,1)",
        borderWidth: 1,
        data: data_contents,
      },
    ],
  };

  return profile ? (
    <Grid>
      <Grid item xs>
        <Autocomplete
          size="small"
          id="team_id"
          options={teamListOptions}
          value={selectedTeam ? selectedTeam : null}
          getOptionSelected={(option, value) =>
            value ? option.id === value.id : null
          }
          onChange={(event) => setSelectedTeam(event.target.textContent)}
          getOptionLabel={(option) => option}
          style={{ width: "50%", marginBottom: "20px" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Team ID or Team Name or Manager Name"
              variant="outlined"
            />
          )}
          noOptionsText="No results found"
        />
      </Grid>
      {resourceCountPerSkill ? (
        <>
          <Grid item xs>
            <ExportChart
              chartContainer={rootContainerId}
              data={resourceCountPerSkill}
            />
          </Grid>
          <Grid item xs id={rootContainerId}>
            <Bar data={chartData} options={chartOptions} />
          </Grid>
        </>
      ) : null}
    </Grid>
  ) : null;
}

const mapStateToProps = (state) => ({
  teams: state.teams,
  resourceCountPerSkill: state.resourceCountPerSkill,
});

export default connect(mapStateToProps, {
  getTeams,
  getResourceCountPerSkill,
})(ResourceCountPerSkill);
