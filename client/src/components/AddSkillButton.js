//#region Import components
// React components
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

// Material UI components
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";

// Common utils and actions
import { getTmInfo } from "../actions";
import SkillDialog from "./SkillDialog";
import { Tooltip } from "@material-ui/core";

//#endregion

function AddSkillButton(props) {
  const { tmInfo, tm_id, profile, getTmInfo } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isAction, setIsAction] = useState("");
  const [currSkill, setCurrSkill] = useState("");
  const [currProficiency, setCurrProficiency] = useState("");

  const skillButtonState = {
    isAction,
    isOpen,
    setIsOpen,
    currSkill,
    setCurrSkill,
    currProficiency,
    setCurrProficiency,
  };

  // Only trigger api call once using the email of the user
  useEffect(() => {
    if (tm_id) getTmInfo({ tm_id });
    // eslint-disable-next-line
  }, [isOpen]);

  return (
    <>
      <Tooltip title="Add Skills">
        <Button
          onClick={() => {
            setIsAction("ADD");
            setIsOpen(true);
          }}
          variant="outlined"
          color="primary"
        >
          <AddCircleIcon />
        </Button>
      </Tooltip>

      <SkillDialog
        profile={profile}
        tmInfo={tmInfo}
        parentState={skillButtonState}
      />
    </>
  );
}

const mapStateToProps = (state) => ({
  tmInfo: state.tmInfo,
});

export default connect(mapStateToProps, { getTmInfo })(AddSkillButton);
