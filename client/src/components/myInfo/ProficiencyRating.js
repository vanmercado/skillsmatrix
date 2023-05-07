import React, { useState } from "react";
import axios from "axios";
import { connect, useSelector } from "react-redux";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { getTmTechInfo } from "../../actions";

import {
  showSuccessMessageBox,
  showErrorMessageBox,
} from "../../utils/CustomSweetAlerts";

const ProficiencyRating = (props) => {
  const { getTmTechInfo } = props;

  const [show, setShow] = useState(false);

  const proficiencies = useSelector((state) => state.proficiencies);

  const handleClick = () => {
    setShow(true);
  };

  const handleBlur = () => {
    setShow(false);
  };

  const updateSkill = (newValue) => {
    const skillId = newValue && newValue.proficiency_id;
    const skillDesc = newValue && newValue.proficiency_desc;
    const proficiencyId = props.tmProficiencyId;
    const email = props.email;
    if (skillId || skillId === 0) {
      if (props.currentRating !== skillDesc) {
        axios
          .put(`/api/tm/bulk/update/${skillId}/${proficiencyId}`)
          .then(({ data }) => {
            showSuccessMessageBox("Success", "Skill/s updated!");
            getTmTechInfo({ email: email });
          })
          .catch(function () {
            showErrorMessageBox("Failed", "Skill/s modification, rejected!");
          });
      }
    }
  };

  if (!show) return <div onClick={handleClick}>{props.currentRating}</div>;
  return (
    <>
      <Autocomplete
        size="small"
        id="personal_rating"
        options={proficiencies.filter((e) => e !== proficiencies[0])}
        getOptionSelected={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.proficiency_desc}
        onChange={(_, newValue) => {
          updateSkill(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.currentRating}
            variant="standard"
            onBlur={handleBlur}
            autoFocus
          />
        )}
        noOptionsText="No results found"
      />
    </>
  );
};

export default connect(null, { getTmTechInfo })(ProficiencyRating);
