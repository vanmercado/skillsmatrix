import React, { useState } from "react";

import { Grid, Button, TextField } from "@material-ui/core";

import { connect, useSelector } from "react-redux";

import {
  getProficiencyApprovalRequests,
  updateTmProficiency,
} from "../../actions";

const Remark = (props) => {
  const { getProficiencyApprovalRequests, updateTmProficiency } = props;

  const [remarks, setRemarks] = useState("");

  const tmTidsInfo = useSelector((state) => state.tmTidsInfo);

  return (
    <>
      <Grid item xs={12}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div>
            <Button
              onClick={() => {
                const now = new Date();
                updateTmProficiency({
                  tmp_id: props.skillId,
                  approval_flag: "A",
                  date_updated: now,
                  updated_by: tmTidsInfo.tm_id,
                  approval_reason: "",
                  proficiency_id: props.tmProficiencyId,
                  date_approved: now,
                  approved_by: tmTidsInfo.tm_id,
                })
                  .then((res) => {
                    getProficiencyApprovalRequests({ email: props.email });
                  })
                  .catch(function () {});
              }}
              color="primary"
              variant="contained"
              style={{
                marginRight: "10px",
                marginTop: "2px",
              }}
              disabled={remarks ? true : false}
            >
              Approve
            </Button>
          </div>
          <TextField
            size="small"
            id="personal_rating"
            label="Send Back Remarks"
            value={remarks}
            onChange={(event) => {
              setRemarks(event.target.value);
            }}
            variant="outlined"
            inputProps={{
              style: { fontSize: 13, lineHeight: "18px" },
            }}
            style={{
              width: "290px",
            }}
            multiline
            minRows={1}
            maxRows={3}
          />
          <div>
            <Button
              size="small"
              disabled={remarks ? false : true}
              onClick={() => {
                setRemarks("");
                const now = new Date();
                updateTmProficiency({
                  tmp_id: props.skillId,
                  approval_flag: "S",
                  date_updated: now,
                  updated_by: tmTidsInfo.tm_id,
                  approval_reason: remarks,
                  proficiency_id: props.tmProficiencyId,
                })
                  .then((res) => {
                    getProficiencyApprovalRequests({
                      email: props.email,
                    });
                  })
                  .catch(function () {});
              }}
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
    </>
  );
};

export default connect(null, {
  getProficiencyApprovalRequests,
  updateTmProficiency,
})(Remark);
