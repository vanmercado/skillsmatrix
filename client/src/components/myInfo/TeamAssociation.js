//#region Import components
// React components
import React, { useEffect } from "react";
import { connect } from "react-redux";

// Material UI components
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

// Common utils and actions
import { getTmTeamAssoc } from "../../actions";
//#endregion

// Explicitly define columns and its options
const columns = [
  {
    name: "jobrole_desc",
    label: "Job Role",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "team_name",
    label: "Team",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "manager_name",
    label: "Manager",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "om_group_desc",
    label: "Operations Group",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "om_name",
    label: "Operations Manager",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "immediate_supervisor",
    label: "Immediate Supervisor",
    options: {
      filter: true,
      sort: true,
    },
  },
];

// Options for Material UI Data Table
const options = {
  filter: false,
  search: false,
  viewColumns: false,
  customToolbar: null,
  responsive: "standard",
  selectableRows: "none",
  sortFilterList: true,
};

// Theme for Material UI Data Table
const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
  });

function TechnicalInfo(props) {
  // Constants initialization
  const { profile, getTmTeamAssoc, teamAssoc } = props;

  // Only trigger api call once using the email of the user
  useEffect(() => {
    if (profile) getTmTeamAssoc({ email: profile.email });
    // eslint-disable-next-line
  }, []);

  return profile && teamAssoc ? (
    // <MuiThemeProvider theme={getMuiTheme()}>
    <MUIDataTable
      title=""
      data={teamAssoc}
      columns={columns}
      options={options}
    />
  ) : // </MuiThemeProvider>
  null;
}

const mapStateToProps = (state) => ({
  teamAssoc: state.teamAssoc,
});

export default connect(mapStateToProps, { getTmTeamAssoc })(TechnicalInfo);
