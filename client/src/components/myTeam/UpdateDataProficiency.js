//#region Import components
// React components
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

// Material UI components
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import MUIDataTable from "mui-datatables";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core";
import theme from "../theme/theme";

// Common utils and actions
import SkillDialog from "../SkillDialog";
import { getTmInfo, getTmTechInfo } from "../../actions";

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

  useEffect(() => {
    if (profile || tmEmail) {
      getTmInfo({ email: tmEmail ? tmEmail : profile.email });
      getTmTechInfo({ email: tmEmail ? tmEmail : profile.email });
    }
    // eslint-disable-next-line
  }, []);

  // Options for Material UI Data Table
  const options = {
    responsive: "standard",
    selectableRows: "none",
    onRowClick: (row) => {
      handleChangeValues(row[0]);
      handleChangeValues(row[1]);
      setIsAction("UPDATE");
      setIsOpen(true);
    },
    sortFilterList: true,
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

  const handleClearValuesAndClose = () => {
    if (setCurrSkill) setCurrSkill("");
    if (setCurrProficiency) setCurrProficiency("");
    setIsOpen(false);
  };

  return (
    <ThemeProvider theme={innerTheme}>
      <Grid item xs={8}>
        <Paper elevation={8} style={{ marginTop: "20px" }}>
          <Box p={4}>
            Simple Description/Instruction about Update Data Proficiency.
          </Box>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: "20px" }}
            onClick={() => {
              window.parent.open("https://forms.gle/1BkiJ9VsJenvpLgh9");
              handleClearValuesAndClose();
            }}
          >
            Open Google Form
          </Button>
        </Paper>
      </Grid>
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
