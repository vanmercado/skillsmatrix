//#region Import components
// React components
import React, { useState, useEffect, createRef } from "react";
import { connect } from "react-redux";

// Material UI components
import Autocomplete from "@material-ui/lab/Autocomplete";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

// Common utils and actions
import { getFas, getFaSnapshot, updateFaSnapshot } from "../../actions";
import { showSuccessMessageBox } from "../../utils/CustomSweetAlerts";
//#endregion

function TeamSnapshotManagement(props) {
  // De-construction of props
  const { profile, getFas, fas, getFaSnapshot, faSnapshot, updateFaSnapshot } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFa, setselectedFa] = useState("");
  const currFaSnapshotRef = createRef();
  var faListOptions = [];

  useEffect(() => {
    if (profile) getFas();
    if (selectedFa) {
      getFaSnapshot({
        faId: selectedFa.substr(0, selectedFa.indexOf(" ")),
      });
    } else getFaSnapshot({ faId: null });
    // eslint-disable-next-line
  }, [selectedFa, isOpen]);

  const handleSave = () => {
    if (currFaSnapshotRef.current !== null) {
      // This assignment is needed to set the FA Snapshot to NULL in the database
      // This condition will be met if the user clicks the Clear button
      if (currFaSnapshotRef.current === "") currFaSnapshotRef.current = null;
      // Actual call for the axios to update the Fa Snapshot
      updateFaSnapshot({
        faId: selectedFa.substr(0, selectedFa.indexOf(" ")),
        newFaSnapshot: currFaSnapshotRef.current,
      });
      setIsOpen(!isOpen);
    }
    // If no changes are made on the FA Snapshot value
    else
      showSuccessMessageBox(
        "Success",
        "No changes made on fa functional_area_desc!"
      );
    handleClear();
    setIsOpen(!isOpen);
  };

  const handleClear = () => {
    currFaSnapshotRef.current = "";
    document.getElementById("faSnapshotTextField").value = "";
  };

  // If fas from state has contents
  if (fas !== null && fas.length > 0) {
    // Iterate for each index
    Array.from(fas).forEach((item) => {
      // Customize the options for the Autocomplete field
      // eg. 855 - TELUS TSBT - D&S JAVA Shared Pool (Dickenson Culala)
      faListOptions.push(
        item.functional_area_id + " - " + item.functional_area_name
      );
    });
  }

  return profile ? (
    <Grid>
      <Grid item xs>
        <Autocomplete
          size="small"
          id="fa_id"
          options={faListOptions}
          value={selectedFa ? selectedFa : null}
          getOptionSelected={(option, value) =>
            value ? option.id === value.id : null
          }
          onChange={(event) => setselectedFa(event.target.textContent)}
          getOptionLabel={(option) => option}
          style={{ width: "50%", marginTop: "15px", marginBottom: "10px" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Functional Area"
              variant="outlined"
            />
          )}
          noOptionsText="No results found"
        />
      </Grid>
      {faSnapshot ? (
        <Grid item xs={8}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <EditIcon />
            &nbsp; Edit Functional Area Snapshot
          </Button>
          <Paper elevation={8} style={{ marginTop: "20px" }}>
            <Box p={4}>
              {faSnapshot && faSnapshot.functional_area_name !== null ? (
                faSnapshot.functional_area_desc
              ) : (
                <h3 style={{ fontFamily: "HelveticaNeueLTStd-Lt" }}>
                  Apologies, for there is no overview of the fa found
                </h3>
              )}
            </Box>
          </Paper>
        </Grid>
      ) : null}
      <Dialog
        open={isOpen}
        onClose={() => {
          handleClear();
          setIsOpen(!isOpen);
        }}
        aria-labelledby="responsive-dialog-title"
        fullWidth={true}
      >
        <DialogTitle id="responsive-dialog-title">
          Update FA Snapshot
          {/* <RichTextEditor /> */}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="faSnapshotTextField"
            variant="outlined"
            color="primary"
            label="FA Snapshot Details"
            rowsMax={Infinity}
            rows={10}
            style={{ width: "100%" }}
            defaultValue={faSnapshot ? faSnapshot.functional_area_desc : null}
            ref={currFaSnapshotRef.current}
            onChange={(event) =>
              (currFaSnapshotRef.current = event.target.value)
            }
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClear();
              setIsOpen(!isOpen);
            }}
            color="primary"
          >
            Close
          </Button>
          <Button onClick={() => handleSave()} color="primary" autoFocus>
            Save
          </Button>
          <Button onClick={() => handleClear()} color="primary">
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  ) : null;
}

const mapStateToProps = (state) => ({
  fas: state.fas,
  faSnapshot: state.faSnapshot,
});

export default connect(mapStateToProps, {
  getFas,
  getFaSnapshot,
  updateFaSnapshot,
})(TeamSnapshotManagement);
