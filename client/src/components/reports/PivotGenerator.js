//#region Import components
// React components
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

// Dedicated components and resources for react pivot table generator
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";

// Material UI components
import Grid from "@material-ui/core/Grid";

// Common utils and actions
import { getPivotGeneratorData } from "../../actions";
//#endregion

function PivotGenerator(props) {

  // De-construction of props
  const { profile, getPivotGeneratorData, pivotGeneratorData } = props;
  const [newProps, setNewProps] = useState(props);

  useEffect(() => {
    if (profile) getPivotGeneratorData();
    // eslint-disable-next-line
  }, [profile]);

  return profile ? (
    <Grid>
      {pivotGeneratorData ? (
        <PivotTableUI
          data={pivotGeneratorData}
          onChange={state => setNewProps(state)}
          {...newProps}
        />
      ) : null}
    </Grid>
  ) : null;

}

const mapStateToProps = (state) => ({ pivotGeneratorData: state.pivotGeneratorData });

export default connect(mapStateToProps, { getPivotGeneratorData })(PivotGenerator);
