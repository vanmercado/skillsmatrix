//#region Import components
// React components
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

// Material UI components
import Autocomplete from "@material-ui/lab/Autocomplete";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

// Common utils and actions
import { getFas, getFaSnapshot } from "../../actions";
//#endregion

function TeamSnapshot(props) {
  // De-construction of props
  const { profile, getFas, fas, getFaSnapshot, faSnapshot } = props;
  const [selectedFa, setSelectedFa] = useState("");
  var faListOptions = [];

  useEffect(() => {
    if (profile) getFas();
    if (selectedFa) {
        getFaSnapshot({
          faId: selectedFa.substr(0, selectedFa.indexOf(" ")),
        });
      
    } else getFaSnapshot({ faId: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFa]);

  // If Fas from state has contents
  if (fas != null && fas.length > 0) {
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
          onChange={(event) => setSelectedFa(event.target.textContent)}
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
      <br />
      {faSnapshot ? (
        <Grid item xs={4}>
          <Paper elevation={8}>
            <Box
              p={4}
              style={{
                textAlign: "left",
                lineHeight: "1.8",
              }}
            >
              {faSnapshot.functional_area_desc != null ? (
                faSnapshot.functional_area_desc
              ) : (
                <h3
                  style={{
                    fontFamily: "HelveticaNeueLTStd-Lt",
                  }}
                >
                  Apologies, No overview of selected functional area found
                </h3>
              )}
            </Box>
          </Paper>
        </Grid>
      ) : null}
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
})(TeamSnapshot);
