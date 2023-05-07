import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

import { useSelector, connect } from "react-redux";
import { getTmTechInfo } from "../../actions";

import {
  openConfirmation,
  showSuccessMessageBox,
  showErrorMessageBox,
} from "../../utils/CustomSweetAlerts";

const SkillsBulkUpdateDialog = (props) => {
  const { getTmTechInfo } = props;
  const [updateSkill, setUpdateSkill] = useState([]);
  const proficiencies = useSelector((state) => state.proficiencies);
  const profile = useSelector((state) => state.profile);

  const handleClose = () => {
    props.close(false);
    setUpdateSkill([]);
  };

  const skillChange = (proficiency, id) => {
    const rating = proficiency && proficiency.proficiency_id;
    if (rating !== null) {
      const findIndex = updateSkill.findIndex((e) => e[1] === id);
      findIndex !== -1 && updateSkill.splice(findIndex, 1);
      setUpdateSkill([...updateSkill, [rating, id]]);
    } else {
      const newSkill = updateSkill.filter((e) => e[1] !== id);
      setUpdateSkill(newSkill);
    }
  };

  const saveChange = () => {
    for (var i = 0; i < updateSkill.length; i++) {
      var rating = updateSkill[i][0];
      var id = updateSkill[i][1];
      axios
        .put(`/api/tm/bulk/update/${rating}/${id}`)
        .then(({ data }) => {})
        .catch(function () {
          showErrorMessageBox("Failed", "Skill/s modification, rejected!");
        });
      if (i === updateSkill.length - 1) {
        showSuccessMessageBox("Success", "Skill/s updated!");
        getTmTechInfo({ email: profile.email });
      }
    }
    handleClose();
  };

  let proficiencyList = [];
  props.forSkillUpdate.forEach((item, index) => {
    proficiencyList.push(
      <center>
        <Autocomplete
          key={index}
          size="small"
          id="personal_rating"
          options={proficiencies}
          defaultValue={item[1]}
          getOptionSelected={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.proficiency_desc || item[1]}
          onChange={(_, newValue) => skillChange(newValue, item[14])}
          style={{ width: "90%", padding: "6px" }}
          renderInput={(params) => (
            <TextField {...params} label={item[0]} variant="outlined" />
          )}
          noOptionsText="No results found"
        />
      </center>
    );
  });

  return (
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"This is for Selected Skill/s Bulk Update"}
        </DialogTitle>
        <DialogContent style={{ padding: "5px" }}>
          {proficiencyList}
        </DialogContent>
        <DialogActions>
          <Button onClick={saveChange} autoFocus>
            Save
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, { getTmTechInfo })(SkillsBulkUpdateDialog);
