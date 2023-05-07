//#region Import components
// React/Redux components
import React, { useState, useEffect } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";

// Material UI components
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  IconButton,
  Drawer,
  Link,
  MenuItem,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Icon from "@material-ui/core/Icon";
import MenuIcon from "@material-ui/icons/Menu";

// Custom styling resources
import "../css/index.css";

// Common utils
import { removeProfileSession } from "../utils/CommonUtils";
import { openConfirmation } from "../utils/CustomSweetAlerts";
//#endregion

// Define the menus available for each role
const renderNavContent = (role) => {
  switch (role) {
    case "member":
      return [
        {
          label: "My Info",
          href: "/myInfo",
          iconName: "account_circle",
        },
        {
          label: "Logout",
          href: "/logout",
          iconName: "logout",
        },
      ];
    case "lead":
      return [
        {
          label: "My Info",
          href: "/myInfo",
          iconName: "account_circle",
        },
        {
          label: "My Team",
          href: "/myTeam",
          iconName: "groups",
        },
        {
          label: "Logout",
          href: "/logout",
          iconName: "logout",
        },
      ];
    case "manager":
      return [
        {
          label: "My Info",
          href: "/myInfo",
          iconName: "account_circle",
        },
        {
          label: "My Team",
          href: "/myTeam",
          iconName: "groups",
        },
        {
          label: "Logout",
          href: "/logout",
          iconName: "logout",
        },
      ];
    case "admin":
      return [
        {
          label: "My Info",
          href: "/myInfo",
          iconName: "account_circle",
        },
        {
          label: "My Team",
          href: "/myTeam",
          iconName: "groups",
        },
        {
          label: "Reports",
          href: "/reports",
          iconName: "bar_chart",
        },
        {
          label: "Admin",
          href: "/admin",
          iconName: "admin_panel_settings",
        },
        {
          label: "Logout",
          href: "/logout",
          iconName: "logout",
        },
      ];
    default:
      return null;
  }
};

// Define custom styles
const useStyles = makeStyles(() => ({
  header: {
    fontFamily: "HelveticaNeueLTStd-Lt",
    backgroundColor: "#4b286d",
    paddingRight: "79px",
    paddingLeft: "118px",
    "@media (max-width: 900px)": {
      paddingLeft: 0,
    },
  },
  logo: {
    fontFamily: "HelveticaNeueLTStd-Lt",
    fontWeight: 600,
    textAlign: "left",
  },
  menuButton: {
    fontFamily: "HelveticaNeueLTStd-Lt",
    fontWeight: 700,
    size: "18px",
    marginLeft: "38px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  drawerContainer: {
    padding: "20px 30px",
  },
}));

// Main function for this component
function Header(props) {
  // Deconstruct styling defined above
  const { header, logo, menuButton, toolbar, drawerContainer } = useStyles();

  // Other constants/state initialization
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const { mobileView, drawerOpen } = state;
  const { loggedIn, profile, tmPosition } = props;

  // Only trigger api call once using the email of the user
  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    // eslint-disable-next-line
  }, []);

  // Handles the OneLogin SSO logout and clearing of sessionStorage
  const handleLogout = () => {
    // If the profile is not empty, remove the profile from sessionStorage
    if (profile) {
      // Trigger to fire sweet alerts for confirmation
      openConfirmation(
        "Confirm logout?",
        "You will be logged out from one login portal",
        "question",
        async (isConfirmed) => {
          // Submission is not confirmed
          if (isConfirmed) removeProfileSession();
          else return;
        }
      );
    }
  };

  // Web Application Logo
  const skillsMatrixLogo = (
    <Typography variant="h6" component="h1" className={logo}>
      <Link href="/myInfo" style={{ textDecoration: "none", color: "#ffffff" }}>
        SKILLS MATRIX
      </Link>
    </Typography>
  );

  // Generate menu buttons for desktop view
  const getMenuButtons = () => {
    if (!tmPosition) return null;
    return renderNavContent(tmPosition).map(({ label, href, iconName }) => {
      return (
        <Button
          {...{
            key: label,
            color: "inherit",
            to: href,
            onClick: label === "Logout" ? handleLogout : null,
            component: RouterLink,
            className: menuButton,
          }}
        >
          <Icon>{iconName}</Icon>&nbsp;
          {label}
        </Button>
      );
    });
  };

  // For desktop view
  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        {skillsMatrixLogo}
        <div>{getMenuButtons()}</div>
      </Toolbar>
    );
  };

  // Generate drawer choiced for mobile view
  const getDrawerChoices = (handleDrawerClose) => {
    if (!tmPosition) return null;
    return renderNavContent(tmPosition).map(({ label, href, iconName }) => {
      return (
        <Link
          {...{
            component: RouterLink,
            to: href,
            onClick: label === "Logout" ? handleLogout : handleDrawerClose,
            color: "inherit",
            style: { textDecoration: "none" },
            key: label,
          }}
        >
          <MenuItem>
            <Icon>{iconName}</Icon>&nbsp;
            {label}
          </MenuItem>
        </Link>
      );
    });
  };

  // For mobile view
  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));
    return (
      <Toolbar>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={drawerContainer}>
            {getDrawerChoices(handleDrawerClose)}
          </div>
        </Drawer>
        <div>{skillsMatrixLogo}</div>
      </Toolbar>
    );
  };

  // Only display the header if the user is logged in
  return loggedIn && profile ? (
    <>
      <Container maxWidth="sm">
        <AppBar position="fixed" className={header}>
          {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
      </Container>
    </>
  ) : null;
}

export default withRouter(Header);
