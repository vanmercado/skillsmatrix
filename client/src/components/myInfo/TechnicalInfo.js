//#region Import components
// React components
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";

// Material UI components
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@material-ui/icons/Delete";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core";

import theme from "../theme/theme";

// Common utils and actions
import SkillDialog from "../SkillDialog";
import { getTmInfo, getTmTechInfo } from "../../actions";

import ProficiencyRating from "./ProficiencyRating";

import {
  openConfirmation,
  showSuccessMessageBox,
  showErrorMessageBox,
} from "../../utils/CustomSweetAlerts";

//#endregion

//Extend the Theme
const innerTheme = createTheme({
  ...theme,
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        cursor: "pointer",
      },
    },
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

function TechnicalInfo(props) {
  // Constants initialization
  const {
    profile,
    getTmInfo,
    tmInfo,
    getTmTechInfo,
    tmTechInfo,
    proficiencies,
    skills,
    tmEmail,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isAction, setIsAction] = useState("");
  const [currSkill, setCurrSkill] = useState("");
  const [currProficiency, setCurrProficiency] = useState("");
  const [rowClick, setRowClick] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState([]);

  useEffect(() => {
    if (profile || tmEmail) {
      getTmInfo({ email: tmEmail ? tmEmail : profile.email });
      getTmTechInfo({ email: tmEmail ? tmEmail : profile.email });
    }
    // eslint-disable-next-line
  }, []);

  // Explicitly define columns and its options
  const columns = [
    {
      name: "skill_desc",
      label: "Skill/Technology",
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
      name: "personal_rating",
      label: "Personal Rating",
      options: {
        customBodyRenderLite: (dataIndex) => {
          if (
            (profile.email !== tmEmail && tmEmail) ||
            selectedSkill.find((e) => e === dataIndex.toString())
          )
            return <div>{tmTechInfo[dataIndex].personal_rating}</div>;
          return (
            <>
              <ProficiencyRating
                currentRating={tmTechInfo[dataIndex].personal_rating}
                tmProficiencyId={tmTechInfo[dataIndex].tmp_id}
                email={tmTechInfo[dataIndex].email}
              />
            </>
          );
        },
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { whiteSpace: "nowrap" },
        }),
      },
    },
    {
      name: "duration_experience",
      label: "Duration of Experience",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { whiteSpace: "nowrap" },
        }),
      },
    },
    {
      name: "lastused_experience",
      label: "Last Used",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    {
      name: "skill_cat_desc",
      label: "Category",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },

    {
      name: "created_by",
      label: "Created by",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    {
      name: "date_created",
      label: "Date Created",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    {
      name: "updated_by",
      label: "Updated by",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    {
      name: "date_updated",
      label: "Date Updated",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    {
      name: "approved_by",
      label: "Approved by",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    {
      name: "date_approved",
      label: "Date Approved",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { whiteSpace: "nowrap" } }),
      },
    },
    {
      name: "approval_reason",
      label: "Remarks",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { whiteSpace: "nowrap" },
        }),
      },
    },
    {
      name: "tmp_id",
      label: "ID",
      options: {
        display: false,
      },
    },
  ];

  const deleteSkills = (displayData) => {
    var tmpId = [];
    var email = profile.email;
    for (var i = 0; i < displayData.length; i++) {
      tmpId.push(displayData[i][13]);
    }
    openConfirmation(
      "Confirm Skill Deletion?",
      "The skill/s that you selected will be removed!",
      "question",
      async (isConfirmed) => {
        if (isConfirmed) deleteSkill(email, tmpId);
        else return;
        getTmTechInfo({ email: tmEmail ? tmEmail : profile.email });
      }
    );
  };

  const deleteSkill = (email, tmpId) => {
    axios
      .delete(`/api/tm/delete/${email}/${tmpId}`)
      .then(({ data }) => {
        showSuccessMessageBox("Success", "Skill/s deleted!");
        getTmTechInfo({ email: tmEmail ? tmEmail : profile.email });
        setSelectedSkill([]);
      })
      .catch(function () {
        showErrorMessageBox("Failed", "Deletion of skill/s, rejected!");
      });
  };

  const selectedToolbar = (selectedRow, displayData) => {
    return (
      <>
        <Grid container justifyContent="flex-end">
          <Tooltip title="Delete">
            <IconButton
              fontSize="small"
              onClick={() => {
                var skillData = [];
                for (var i = 0; i < selectedRow.data.length; i++) {
                  skillData.push(displayData[selectedRow.data[i].index].data);
                }
                deleteSkills(skillData);
              }}
            >
              <DeleteIcon color="action" fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
      </>
    );
  };

  // Options for Material UI Data Table
  const options = {
    responsive: "standard",
    selectableRows: tmEmail
      ? profile.email !== tmEmail
        ? "none"
        : "multiple"
      : "multiple",
    sortFilterList: true,
    fixedHeader: true,
    fixedSelectColumn: false,
    tableBodyHeight: "480px",
    selectableRowsHeader: null,
    onRowClick: (row, rowMeta) => {
      handleChangeValues(tmTechInfo[rowMeta.dataIndex].skill_desc);
      handleChangeValues(tmTechInfo[rowMeta.dataIndex].personal_rating);
      setRowClick(row);
    },
    onCellClick: (value, row) => {
      if (tmEmail) {
        if (profile.email !== tmEmail) {
        } else {
          if (!selectedSkill.find((e) => e === row.dataIndex.toString())) {
            if (row.colIndex !== 1) {
              setIsAction("UPDATE");
              setIsOpen(true);
            }
          }
        }
      } else {
        if (!selectedSkill.find((e) => e === row.dataIndex.toString())) {
          if (row.colIndex !== 1) {
            setIsAction("UPDATE");
            setIsOpen(true);
          }
        }
      }
    },

    customToolbarSelect: selectedToolbar,
    onRowSelectionChange: (row, allSelectedRow, selectedRowIndex) => {
      const deleteSelected = [];
      for (var i = 0; i < allSelectedRow.length; i++) {
        deleteSelected.push(allSelectedRow[i].dataIndex.toString());
      }
      setSelectedSkill(deleteSelected);
    },
  };

  // Updating current skill and proficiency state values
  const handleChangeValues = (description) => {
    // If the description is existing from the proficiencies array of objects
    if (
      proficiencies.some((proficiency) =>
        proficiency.proficiency_desc.includes(description)
      )
    ) {
      setCurrProficiency(
        proficiencies.find(
          (proficiency) => proficiency.proficiency_desc === description
        )
      );
    } else {
      setCurrSkill(skills.find((skill) => skill.skill_desc === description));
    }
  };

  const techInfoState = {
    isAction,
    isOpen,
    setIsOpen,
    currSkill,
    setCurrSkill,
    currProficiency,
    setCurrProficiency,
    handleChangeValues,
  };

  return (
    <ThemeProvider theme={innerTheme}>
      <Grid container spacing={3}>
        {tmInfo &&
        profile.email.toLowerCase() === tmInfo.email.toLowerCase() ? (
          <Grid item xs={12}>
            <Button
              onClick={() => {
                setIsAction("ADD");
                setIsOpen(true);
                setRowClick([]);
              }}
              variant="contained"
              color="primary"
            >
              <Icon>add_circle</Icon>&nbsp; Add Skills
            </Button>
          </Grid>
        ) : null}
        {profile && tmTechInfo ? (
          <Grid item xs={12}>
            <MUIDataTable
              title=""
              data={tmTechInfo}
              columns={columns}
              options={options}
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <h2 style={{ fontFamily: "HelveticaNeueLTStd-Lt" }}>
              {tmEmail
                ? "This Team Member has no technical information"
                : "You currently have no skills, add one now!"}
            </h2>
          </Grid>
        )}
      </Grid>
      <SkillDialog
        profile={profile}
        tmInfo={tmInfo}
        parentState={techInfoState}
        items={rowClick}
      />
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  tmInfo: state.tmInfo,
  tmTechInfo: state.tmTechInfo,
  skills: state.skills,
  proficiencies: state.proficiencies,
});

export default connect(mapStateToProps, {
  getTmInfo,
  getTmTechInfo,
})(TechnicalInfo);
