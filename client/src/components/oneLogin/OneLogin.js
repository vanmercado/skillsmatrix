import React, { useEffect } from "react";
import { connect } from "react-redux";
import Loader from "react-loader";

import * as oidcApi from "../../api/oidcApi";
import { generateStateAndNonce } from "../../actions/token";

const OneLogin = ({ state, nonce, generateParams }) => {

  if (state === null || nonce === null) {
    generateParams();
  }

  else {
    oidcApi.beginAuth({ state, nonce });
  }

  // Updates the page title
  useEffect(() => {
    document.title = "Skills Matrix App OneLogin";
  });

  return <Loader />;
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  state: state.token.state,
  nonce: state.token.nonce
});

const mapDispatchToProps = (dispatch) => ({
  generateParams: () => dispatch(generateStateAndNonce()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OneLogin);
