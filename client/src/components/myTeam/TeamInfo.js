//#region Import components
// React components
import React, { useEffect } from "react";
import { connect } from "react-redux";

// Material UI components
import MUIDataTable from "mui-datatables";
// import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

// Common utils and actions
import AddSkillButton from "../AddSkillButton";
import TechnicalInfoDialog from "../TechnicalInfoDialog";
import { getTlTeamInfo } from "../../actions";
import { Box } from "@material-ui/core";
//#endregion

// Explicitly define columns and its options
const columns = [
  {
    name: "tm_id",
    label: "Workday ID",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "tm_name",
    label: "Team Member Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "job_profile_name",
    label: "Job Profile Description",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "email",
    label: "Work Email",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "team_name",
    label: "Team Description",
    options: {
      filter: true,
      sort: true,
    },
  },
];

// Theme for Material UI Data Table
// const getMuiTheme = () =>
//   createMuiTheme({
//     overrides: {
//       MUIDataTableBodyCell: {
//         root: {
//           backgroundColor: "#FFFFFF",
//         },
//       },
//     },
//   });

function TeamInfo(props) {
  // Constants initialization
  const { profile, getTlTeamInfo, teamInfo } = props;

  // Only trigger api call once using the email of the user
  useEffect(() => {
    if (profile) getTlTeamInfo({ email: profile.email });
    // eslint-disable-next-line
  }, []);

  // Options for Material UI Data Table
  const options = {
    responsive: "standard",
    selectableRows: "none",
    sortFilterList: true,
  };

  const muiDataTableColumns = [
    ...columns,
    {
      name: "team_action",
      label: "Action",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box display="flex">
              <AddSkillButton tm_id={tableMeta.rowData[0]} profile={profile} />
              <div style={{ marginRight: "10px" }} />
              <TechnicalInfoDialog
                profile={profile}
                tmEmail={tableMeta.rowData[3]}
                tmName={tableMeta.rowData[1]}
              />
            </Box>
          );
        },
      },
    },
  ];

  return profile && teamInfo ? (
    <>
      {/* <MuiThemeProvider theme={getMuiTheme()}> */}
      <MUIDataTable
        title=""
        data={teamInfo}
        columns={muiDataTableColumns}
        options={options}
      />
      {/* </MuiThemeProvider> */}
    </>
  ) : null;
}

const mapStateToProps = (state) => ({ teamInfo: state.teamInfo });

export default connect(mapStateToProps, { getTlTeamInfo })(TeamInfo);
