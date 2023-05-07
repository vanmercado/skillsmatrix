//#region Import components
// React components
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

// Material UI components
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core";

import MUIDataTable from "mui-datatables";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Remark from "./Remark";

import {
  getProficiencyApprovalRequests,
  updateTmProficiency,
} from "../../actions";
import theme from "../theme/theme";

import _ from "lodash";
//#endregion

// Theme for Material UI Data Table
const innerTheme = createTheme({
  ...theme,
  overrides: {
    MUIDataTableToolbarSelect: {
      title: {
        whiteSpace: "nowrap",
      },
      root: {
        minHeight: "48px",
        paddingRight: "24px",
      },
    },
  },
});

const ProficiencyApprovalRequests = (props) => {
  const {
    profile,
    proficiencies,
    getProficiencyApprovalRequests,
    proficiencyApprovalRequests,
    updateTmProficiency,
    tmTidsInfo,
  } = props;

  const [selectedSkill, setSelectedSkill] = useState([]);

  useEffect(() => {
    if (profile) {
      getProficiencyApprovalRequests({ email: profile.email });
    }
    // eslint-disable-next-line
  }, []);

  const selectedToolbar = (selectedRow, displayData) => {
    return (
      <>
        <Grid container justifyContent="flex-end">
          <Tooltip title="Approve">
            <IconButton
              fontSize="small"
              onClick={() => {
                var skillData = [];
                const now = new Date();
                for (var i = 0; i < selectedRow.data.length; i++) {
                  skillData.push(displayData[selectedRow.data[i].index].data);
                  updateTmProficiency({
                    tmp_id: skillData[i][0],
                    approval_flag: "A",
                    date_updated: now,
                    updated_by: tmTidsInfo.tm_id,
                    approval_reason: "",
                    proficiency_id: proficiencies.find(
                      (e) => e.proficiency_desc === skillData[i][5]
                    ).proficiency_id,
                    date_approved: now,
                    approved_by: tmTidsInfo.tm_id,
                  }).then((res) => {
                    getProficiencyApprovalRequests({ email: profile.email });
                    setSelectedSkill([]);
                  });
                }
                getProficiencyApprovalRequests({ email: profile.email });
              }}
            >
              <ThumbUpIcon color="action" fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
      </>
    );
  };

  const options = {
    responsive: "standard",
    selectableRows: "multiple",
    sortFilterList: true,
    fixedHeader: true,
    fixedSelectColumn: false,
    selectableRowsHeader: null,
    filterType: "checkbox",
    tableBodyHeight: "440px",
    sortOrder: {
      name: "date_created",
      direction: "desc",
    },
    customToolbarSelect: selectedToolbar,
    onRowSelectionChange: (row, allSelectedRow, selectedRowIndex) => {
      const approve = [];
      for (var i = 0; i < allSelectedRow.length; i++) {
        approve.push(allSelectedRow[i].dataIndex.toString());
      }
      setSelectedSkill(approve);
    },
  };

  const columns = [
    {
      label: "tmp_id",
      name: "tmp_id",
      options: {
        display: false,
      },
    },
    {
      label: "skill_id",
      name: "skill_id",
      options: {
        display: false,
      },
    },

    {
      label: "Team Member Name",
      name: "tm_name",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            whiteSpace: "nowrap",
            position: "sticky",
            left: "0",
            background: "white",
            zIndex: 100,
          },
        }),
        setCellHeaderProps: () => ({
          style: {
            whiteSpace: "nowrap",
            position: "sticky",
            left: 0,
            background: "white",
            zIndex: 101,
          },
        }),
      },
    },
    {
      label: "Workday ID",
      name: "tm_id",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },

    {
      label: "Skill Name",
      name: "skill_desc",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    {
      label: "Personal Rating",
      name: "personal_rating_desc",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    // {
    //   label: "Years of Experience",
    //   name: "duration_experience",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
    // {
    //   label: "Last Used",
    //   name: "lastused_experience",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
    {
      label: "Date Submitted",
      name: "date_created",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
  ];

  const muiDataTableColumns = [
    ...columns,
    {
      name: "team_action",
      label: "Actions / Remarks",
      options: {
        customBodyRenderLite: (dataIndex) => {
          if (selectedSkill.find((e) => e === dataIndex.toString())) {
            return (
              <Grid item xs={12}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    style={{
                      marginRight: "10px",
                      marginTop: "2px",
                    }}
                    disabled={true}
                  >
                    Approve
                  </Button>
                  <TextField
                    size="small"
                    id="personal_rating"
                    label="Send Back Remarks"
                    variant="outlined"
                    inputProps={{
                      style: { fontSize: 13, lineHeight: "18px" },
                    }}
                    style={{
                      width: "290px",
                    }}
                    multiline
                    rows={1}
                    maxRows={3}
                    disabled={true}
                  />
                  <div>
                    <Button
                      size="small"
                      disabled={true}
                      style={{
                        marginLeft: "10px",
                        width: "90px",
                      }}
                      color="primary"
                      variant="contained"
                    >
                      Send Back
                    </Button>
                  </div>
                </div>
              </Grid>
            );
          } else {
            return (
              <>
                <Remark
                  email={profile.email}
                  skillId={proficiencyApprovalRequests[dataIndex].tmp_id}
                  tmProficiencyId={
                    proficiencyApprovalRequests[dataIndex].personal_rating
                  }
                />
              </>
            );
          }
        },
      },
    },
  ];

  return (
    <>
      <ThemeProvider theme={innerTheme}>
        {_.isEmpty(proficiencyApprovalRequests) ? null : (
          <MUIDataTable
            data={proficiencyApprovalRequests}
            columns={muiDataTableColumns}
            options={options}
          />
        )}
      </ThemeProvider>
    </>
  );
};

const mapStateToProps = (state) => ({
  proficiencyApprovalRequests: state.proficiencyApprovalRequests,
  proficiencies: state.proficiencies,
  tmTidsInfo: state.tmTidsInfo,
});

export default connect(mapStateToProps, {
  getProficiencyApprovalRequests,
  updateTmProficiency,
})(ProficiencyApprovalRequests);
