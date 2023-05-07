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
import { getTeams, getProficiencyCountPerSkill } from "../../actions";
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
            labelString: "Proficiency",
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

function ProficiencyCountPerSkill(props) {
  // De-construction of props
  const {
    profile,
    getTeams,
    teams,
    getProficiencyCountPerSkill,
    proficiencyCountPerSkill,
  } = props;
  const [selectedTeam, setSelectedTeam] = useState("");
  var teamListOptions = [];

  // Placeholders for the extracted labels and values
  var label_contents = [],
    data0_contents = [],
    data1_contents = [],
    data2_contents = [],
    data3_contents = [],
    data4_contents = [];

  useEffect(() => {
    if (profile) getTeams();
    if (selectedTeam) getProficiencyCountPerSkill({ teamId: selectedTeam });
    else getProficiencyCountPerSkill({ teamId: null });
    // eslint-disable-next-line
  }, [selectedTeam]);

  if (proficiencyCountPerSkill) {
    // Iterate for each index

    Array.from(proficiencyCountPerSkill).forEach(function (
      proficiencyCountPerSkill
    ) {
      label_contents.push(proficiencyCountPerSkill.skill_desc);
      data0_contents.push(proficiencyCountPerSkill.no_knowledge);
      data1_contents.push(proficiencyCountPerSkill.learning_in_progress);
      data2_contents.push(proficiencyCountPerSkill.intermediate);
      data3_contents.push(proficiencyCountPerSkill.proficient);
      data4_contents.push(proficiencyCountPerSkill.subject_matter_expert);
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
        label: "No Knowledge",
        backgroundColor: "rgba(5, 198, 0,0.5)",
        borderColor: "rgba(5, 198, 0,1)",
        borderWidth: 1,
        data: data0_contents,
      },
      {
        label: "Learning in Progress",
        backgroundColor: "rgba(255, 254, 5,0.5)",
        borderColor: "rgba(255, 254, 5,1)",
        borderWidth: 1,
        data: data1_contents,
      },
      {
        label: "Intermediate",
        backgroundColor: "rgba(255, 0, 0,0.5)",
        borderColor: "rgba(255, 0, 0,1)",
        borderWidth: 1,
        data: data2_contents,
      },
      {
        label: "Proficient",
        backgroundColor: "rgba(0, 178, 201,0.5)",
        borderColor: "rgba(0, 178, 201,1)",
        borderWidth: 1,
        data: data3_contents,
      },
      {
        label: "Subject Matter Expert",
        backgroundColor: "rgba(153, 0, 204,0.5)",
        borderColor: "rgba(153, 0, 204,1)",
        borderWidth: 1,
        data: data4_contents,
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
      {proficiencyCountPerSkill ? (
        <>
          <Grid item xs>
            <ExportChart
              chartContainer={rootContainerId}
              data={proficiencyCountPerSkill}
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
  proficiencyCountPerSkill: state.proficiencyCountPerSkill,
});

export default connect(mapStateToProps, {
  getTeams,
  getProficiencyCountPerSkill,
})(ProficiencyCountPerSkill);
