//#region Import components
// React components
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import SkillDialog from "./SkillDialog";
import {
  updateTmProficiency,
  getTmInfo,
  getProficiencyApprovalRequests,
} from "../actions";
//#endregion

const ApproveButton = (props) => {
  const { getTmInfo, tmInfo, profile, tmp_id, skill_id, skill_desc } = props;

  useEffect(() => {
    getTmInfo({ email: profile.email });
    // eslint-disable-next-line
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [currProficiency, setCurrProficiency] = useState("");

  const ApproveButtonState = {
    isAction: "UPDATE",
    isOpen,
    setIsOpen,
    currSkill: { skill_id, skill_desc },
    isApprove: true,
    currProficiency,
    setCurrProficiency,

    tmp_id,
  };

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        variant="contained"
        color="primary"
      >
        Approve
      </Button>
      <SkillDialog profile={tmInfo} parentState={ApproveButtonState} />
    </>
  );
};

const mapStateToProps = (state) => ({
  tmInfo: state.tmInfo,
});

export default connect(mapStateToProps, {
  updateTmProficiency,
  getTmInfo,
  getProficiencyApprovalRequests,
})(ApproveButton);
