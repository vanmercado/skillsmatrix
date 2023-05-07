//#region Import components
// React components
import React, { useEffect } from "react";
import { connect } from "react-redux";

// Material UI components
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

// Common utils and actions

import {
  updateSkillProficiency,
  addSkillProficiency,
  deleteSkillProficiency,
  getProficiencies,
  getSkills,
} from "../actions";
//#endregion

function IdealProficiencySkillDialog(props) {
  const {
    updateSkillProficiency,
    addSkillProficiency,
    getProficiencies,
    deleteSkillProficiency,
    proficiencies,
    getSkills,
    skills,
  } = props;

  const {
    isAction,
    isOpen,
    setIsOpen,
    isApprove,
    currSkill,
    setCurrSkill,
    currProficiency,
    setCurrProficiency,
    currTjrip,
    currJobRoleId,
    currTeamId,
  } = props.parentState;

  let { handleChangeValues } = props.parentState;

  // const [initialProficiency, setInitialProficiency] = useState({});

  useEffect(() => {
    getProficiencies();
    getSkills();
    // eslint-disable-next-line
  }, [isOpen]);

  // useEffect(() => {
  //   setInitialProficiency(currProficiency);
  //   // eslint-disable-next-line
  // }, [isOpen]);

  if (!handleChangeValues) {
    // Updating current skill and proficiency state values
    handleChangeValues = (description) => {
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
  }

  // Clear current skill and proficiency state values
  const handleClearValuesAndClose = () => {
    if (setCurrSkill) setCurrSkill("");
    if (setCurrProficiency) setCurrProficiency("");
    setIsOpen(!isOpen);
  };

  const handleUpdateSkillProficiency = () => {
    updateSkillProficiency({
      ideal_proficiency: currTjrip,
      proficiency_id: currProficiency.proficiency_id,
    });
    handleClearValuesAndClose();
  };

  const handleAddSkillProficiency = () => {
    addSkillProficiency({
      skill_id: currSkill.skill_id,
      proficiency_id: currProficiency.proficiency_id,
      job_profile_id: currJobRoleId,
      team_id: currTeamId,
    });
    handleClearValuesAndClose();
  };

  const handleDeleteSkillProficiency = () => {
    deleteSkillProficiency({
      ideal_proficiency: currTjrip,
    });
    handleClearValuesAndClose();
  };

  //Will appear when no skill found
  const noSkillAddButton = (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <h4>No results found</h4>
      <Button
        variant="outlined"
        color="primary"
        onMouseDown={() => {
          window.parent.open("https://forms.gle/iB2zR4zd4yhFSqp28");
          handleClearValuesAndClose();
        }}
      >
        Request to add skill
      </Button>
    </Box>
  );
  return (
    <Dialog
      title="Skill Information"
      open={isOpen}
      onClose={() => handleClearValuesAndClose()}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Skill Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel htmlFor="skills">
              Skill Set / Technology / Application
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              size="small"
              id="skill_id"
              options={skills}
              value={currSkill ? currSkill : null}
              disabled={isAction === "UPDATE" ? true : false}
              getOptionSelected={(option, value) =>
                value ? option.id === value.id : null
              }
              onChange={(event) => handleChangeValues(event.target.textContent)}
              getOptionLabel={(option) => option.skill_desc}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select skill"
                  variant="outlined"
                />
              )}
              noOptionsText={noSkillAddButton}
            />
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="rating">
              Ideal Proficiency Level Rating
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              size="small"
              id="proficiency_id"
              options={proficiencies}
              value={currProficiency ? currProficiency : null}
              getOptionSelected={(option, value) =>
                value ? option.id === value.id : null
              }
              onChange={(event) => handleChangeValues(event.target.textContent)}
              getOptionLabel={(option) => option.proficiency_desc}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select proficiency"
                  variant="outlined"
                />
              )}
              noOptionsText="No results found"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClearValuesAndClose();
          }}
          color="primary"
        >
          Close
        </Button>

        {isAction === "ADD" ? (
          <Button
            onClick={handleAddSkillProficiency}
            color="primary"
            autoFocus
            disabled={
              currSkill && currProficiency && currJobRoleId && currTeamId
                ? false
                : true
            }
          >
            Save
          </Button>
        ) : (
          <>
            <Button
              onClick={handleUpdateSkillProficiency}
              color="primary"
              autoFocus
            >
              Update
            </Button>
            {!isApprove ? (
              <Button
                onClick={handleDeleteSkillProficiency}
                color="primary"
                autoFocus
              >
                Delete
              </Button>
            ) : null}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = (state) => ({
  proficiencies: state.proficiencies,
  skills: state.skills,
});

export default connect(mapStateToProps, {
  updateSkillProficiency,
  addSkillProficiency,
  deleteSkillProficiency,
  getProficiencies,
  getSkills,
})(IdealProficiencySkillDialog);
