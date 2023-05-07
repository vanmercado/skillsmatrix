//#region Import components
// React/Redux components
import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme/theme";

// Custom styling resources
import "../css/index.css";

// OneLogin components
import Auth from "./oneLogin/Auth";
import OneLogin from "./oneLogin/OneLogin";

// Common components
import {
  getTmPosition,
  getTmTidsInfo,
  getHrTaInfo,
  getTlTeamMemberCount,
} from "../actions";
import PrivateRoute from "../utils/PrivateRoute";
import { getProfile } from "../utils/CommonUtils";

// Child components
import Header from "./Header";
import MyInfo from "./myInfo/MyInfo";
import MyTeam from "./myTeam/MyTeam";
import Reports from "./reports/Reports";
import Admin from "./admin/Admin";

import { TableCell } from "@material-ui/core";

//#endregion

function App(props) {
  // Constants initialization
  const {
    loggedIn,
    getTmPosition,
    position,
    getTmTidsInfo,
    tmTidsInfo,
    getHrTaInfo,
    hrTaInfo,
    getTlTeamMemberCount,
    tlTeamMemberCount,
  } = props;
  const profile = getProfile();

  // Determine if the job level is either an admin, member or manager using the position retrieved
  var tmPosition = "member";

  if (position) {
    if (position.job_level === "OFCR1" || position.job_level === "OFCR2")
      tmPosition = "lead";
    else if (position.job_level === "OFCR3" && tlTeamMemberCount > 0)
      tmPosition = "lead";
    else if (
      position.job_level === "MGR" ||
      position.job_level === "DIR" ||
      position.job_level === "EXEC"
    )
      tmPosition = "manager";
  }

  // Determine if the current user is a non-TIDS team member
  if (!tmTidsInfo) tmPosition = "nonTIDSteamMember";

  // Determine if the current user is a HR or TA
  if (hrTaInfo)
    if (hrTaInfo.user_email && hrTaInfo.user_status === 1) tmPosition = "admin";

  // Only trigger api call several times using the email of the user
  useEffect(() => {
    if (profile) {
      getTmPosition({ email: profile.email });
      getTmTidsInfo({ email: profile.email });
      getHrTaInfo({ email: profile.email });
      getTlTeamMemberCount({ email: profile.email });
    }
    // eslint-disable-next-line
  }, [loggedIn]);

  // if (profile) profile.email = "ladynila.prado@telusinternational.com";
  // if (profile) profile.email = "dickenson.culala@telusinternational.com";
  // if (profile) profile.email = "";

  const oldRender = TableCell.render;

  TableCell.render = function (...args) {
    const [props, ...otherArgs] = args;
    if (typeof props === "object" && props && "isEmpty" in props) {
      const { isEmpty, ...propsWithoutEmpty } = props;
      return oldRender.apply(this, [propsWithoutEmpty, ...otherArgs]);
    } else {
      return oldRender.apply(this, args);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {
          // Do not render Header if the member is non-TIDS or not part of HR/TA special access
          tmTidsInfo || hrTaInfo ? (
            <Header
              loggedIn={profile ? Boolean(profile) : !loggedIn}
              profile={profile}
              tmPosition={tmPosition}
            />
          ) : null
        }
        <div className="tip-font">
          <Switch>
            <Route exact path="/">
              <Redirect to="/myInfo" />
            </Route>
            <Route exact path="/logout">
              <Redirect to="/myInfo" />
            </Route>
            <Route exact path="/auth" component={Auth} />
            <PrivateRoute
              exact
              path="/onelogin"
              redirect="/myInfo"
              component={OneLogin}
              open={profile ? Boolean(profile) : !loggedIn}
            />
            <PrivateRoute
              exact
              path="/myInfo"
              redirect="/onelogin"
              component={() => (
                <MyInfo profile={profile} tmPosition={tmPosition} />
              )}
              open={loggedIn}
            />
            <PrivateRoute
              exact
              path="/myTeam"
              redirect="/onelogin"
              component={() => (
                <MyTeam profile={profile} tmPosition={tmPosition} />
              )}
              open={loggedIn}
            />
            <PrivateRoute
              exact
              path="/reports"
              redirect="/onelogin"
              component={() => (
                <Reports profile={profile} tmPosition={tmPosition} />
              )}
              open={loggedIn}
            />
            <PrivateRoute
              exact
              path="/admin"
              redirect="/onelogin"
              component={() => (
                <Admin profile={profile} tmPosition={tmPosition} />
              )}
              open={loggedIn}
            />
          </Switch>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  loggedIn: Boolean(state.token.accessToken),
  profile: state.profile,
  position: state.position,
  tmTidsInfo: state.tmTidsInfo,
  hrTaInfo: state.hrTaInfo,
  tlTeamMemberCount: state.tlTeamMemberCount,
});

export default connect(mapStateToProps, {
  getTmPosition,
  getTmTidsInfo,
  getHrTaInfo,
  getTlTeamMemberCount,
})(App);
