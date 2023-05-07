import React from "react";
import { Route, Redirect } from "react-router-dom";

/**
 * PrivateRoutes locks a route unless the open prop is true
 *
 * @param {Bool} open - if true, renders `q`compenent` prop. If false, redirects to `redirect` location
 * @param {Component} component - Component to render when accessible
 * @param {String} redirect - path to redirect to when inaccessible
 */
function PrivateRoute({ open, component: Component, redirect, ...rest }) {
  // Return `component` if there exists a token (from traditional login) or a value for `open` variable (from OneLogin)
  return (
    <Route
      {...rest}
      render={(props) =>
        open
          ? <Component {...props} />
          : <Redirect to={redirect} />
      }
    />
  );

}

export default PrivateRoute;
