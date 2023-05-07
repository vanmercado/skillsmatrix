//#region Import components
// React components
import React, { useState, forwardRef } from "react";

// Material UI components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TechnicalInfo from "./myInfo/TechnicalInfo";
import { Tooltip } from "@material-ui/core";
//#endregion

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    fontWeight: 500,
    fontFamily: "HelveticaNeueLTStd-Lt",
  },
}));

function TechnicalInfoDialog(props) {
  // Constants initialization
  const { tmEmail, tmName, profile } = props;
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [tmTechInfoDialogTitle, setTmTechInfoDialogTitle] = useState(false);

  // Function calls upon opening dialog
  const handleOpenDialog = () => {
    setTmTechInfoDialogTitle(tmName);
    setIsOpen(true);
  };

  // Function calls upon closing dialog
  const handleCloseDialog = () => {
    setTmTechInfoDialogTitle("");
    setIsOpen(false);
  };

  return (
    <>
      <Tooltip title="View Skills">
        <Button
          onClick={() => handleOpenDialog()}
          variant="outlined"
          color="primary"
        >
          <VisibilityIcon />
        </Button>
      </Tooltip>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={() => handleCloseDialog()}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => handleCloseDialog()}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {`Technical Information of ${tmTechInfoDialogTitle}`}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TechnicalInfo profile={profile} tmEmail={tmEmail} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TechnicalInfoDialog;
