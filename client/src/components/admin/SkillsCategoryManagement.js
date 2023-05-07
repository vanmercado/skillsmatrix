//#region Import components
// React components
import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

// Material UI components
import MUIDataTable from "mui-datatables";
import {
  makeStyles,
  withStyles
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Common utils and actions
import {
  getSkillCategories,
  getChildSkills,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkill,
  deleteSkill,
} from "../../actions";
//#endregion

//#region Region for Dialog Components and its styling
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
//#endregion

// Theme for Material UI Data Table
// const getMuiTheme = () =>
//   createMuiTheme({
//     overrides: {
//       MUIDataTableBodyCell: {
//         root: {
//           backgroundColor: "#FFFFFF",
//         },
//       },
//     },
//   });

// Styling for specific components
const useStyles = makeStyles((theme) => ({
  chips: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  textField: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "45ch",
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  dialogContentGrid: {
    flexGrow: "1 !important",
    width: "100% !important",
  },
}));

// Explicitly define columns and its options
const columns = [
  {
    name: "skill_cat_id",
    label: "ID",
    options: {
      display: false,
      filter: true,
      sort: true,
    },
  },
  {
    name: "skill_cat_desc",
    label: "Category",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "child_skills",
    label: "Child Skills",
    options: {
      filter: true,
      sort: true,
    },
  },
];

function SkillsCategoryManagement(props) {
  // Constants initialization
  const {
    profile,
    getSkillCategories,
    skillCategories,
    getChildSkills,
    childSkills,
    createSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    createSkill,
    deleteSkill,
  } = props;
  const [open, setOpen] = useState(false);
  const [isAction, setIsAction] = useState("");
  const newSkillDescRef = useRef();
  const newSkillCatDescRef = useRef();
  const modalTitleSkillCatDescRef = useRef();
  const classes = useStyles();

  // Options for Material UI Data Table
  const options = {
    responsive: "standard",
    selectableRows: "none",
    onRowClick: (row) => {
      // Trigger to update state for child skills
      getChildSkills({ skill_cat_id: row[0] });
      // Set action as update upon trigger
      setIsAction("UPDATE");
      // Update value of modal title upon trigger
      modalTitleSkillCatDescRef.current = row[1];
      // Open the modal
      setOpen(true);
    },
    sortFilterList: true,
  };

  const handleClose = () => {
    if (isAction === "UPDATE") {
      let modalTitleSkillCatDesc = document.getElementById(
        "modal_title_skill_cat_desc"
      );
      if (modalTitleSkillCatDesc) modalTitleSkillCatDesc.value = "";
      modalTitleSkillCatDescRef.current = "";
      // Update the state to reflect the newly added skill
      getChildSkills({ skill_cat_id: childSkills[0].skill_cat_id });
    } else if (isAction === "ADD") {
      // Get updated skill categories
      getSkillCategories();
    }
    setIsAction("");
    setOpen(false);
  };

  const handleCreateSkillsCategory = () => {
    // Only proceed if the value of the skill desc is not empty
    if (newSkillCatDescRef.current) {
      // Actual call for creation of skill category
      createSkillCategory({ skill_cat_desc: newSkillCatDescRef.current });
      // Clear the input field
      document.getElementById("new_skill_cat_desc").value = "";
      // Clear the state ref
      newSkillCatDescRef.current = "";
    }
    handleClose();
  };

  const handleUpdateSkillCategory = () => {
    // Actual call for updating of skill category
    updateSkillCategory({
      skill_cat_id: childSkills[0].skill_cat_id,
      old_skill_cat_desc: childSkills[0].skill_cat_desc,
      new_skill_cat_desc: modalTitleSkillCatDescRef.current,
    });
    handleClose();
  };

  const handleDeleteSkillCategory = () => {
    // Actual call for deletion of skill category
    deleteSkillCategory({
      skill_cat_id: childSkills[0].skill_cat_id,
      skill_cat_desc: modalTitleSkillCatDescRef.current,
    });
    handleClose();
  };

  const handleCreateSkill = () => {
    // Only proceed if the value of the skill desc is not empty
    if (newSkillDescRef.current) {
      // Actual call for creation of skill
      createSkill({
        skill_desc: newSkillDescRef.current,
        skill_cat_id: childSkills[0].skill_cat_id,
      });
      // Clear the input field
      document.getElementById("new_skill_desc").value = "";
      // Clear the state ref
      newSkillDescRef.current = "";
    }
    handleClose();
  };

  const handleDeleteSkill = (skill_cat_id, skill_id) => {
    if (skill_cat_id && skill_id) {
      // Actual call for deletion of skill
      deleteSkill({
        skill_cat_id: skill_cat_id,
        skill_id: skill_id,
      });
    }
    handleClose();
  };

  // Only trigger api call once using the email of the user
  useEffect(() => {
    if (profile || !open) getSkillCategories();
    // eslint-disable-next-line
  }, [open]);

  const contentForCreatingSkillCategory = () => {
    return (
      <Grid
        container
        align="center"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        className={classes.dialogContentGrid}
      >
        <Grid item xs={12} className={classes.textField}>
          <TextField
            required
            id="new_skill_cat_desc"
            label="Skill Category Description"
            variant="outlined"
            ref={newSkillCatDescRef}
            onChange={(event) =>
              (newSkillCatDescRef.current = event.target.value)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<SaveIcon />}
            onClick={handleCreateSkillsCategory}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    );
  };

  const contentForAddingSkillsOnSkillCategory = () => {
    return (
      <Grid
        container
        align="center"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        className={classes.dialogContentGrid}
      >
        <Grid item xs={12} className={classes.textField}>
          <TextField
            id="new_skill_desc"
            label="Skill Description"
            variant="outlined"
            ref={newSkillDescRef}
            onChange={(event) => (newSkillDescRef.current = event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<AddIcon />}
            onClick={() => handleCreateSkill()}
          >
            Add Skill
          </Button>
        </Grid>
        <Grid item xs={12} className={classes.chips}>
          {Array.isArray(childSkills) && childSkills.length > 0
            ? childSkills[0].skill.map((item) => (
                <Chip
                  key={item.skill_id + "-" + item.skill_desc}
                  variant="outlined"
                  size="small"
                  label={item.skill_desc}
                  onDelete={() =>
                    handleDeleteSkill(item.skill_cat_id, item.skill_id)
                  }
                />
              ))
            : null}
        </Grid>
      </Grid>
    );
  };

  return profile ? (
    <>
      {/* <MuiThemeProvider theme={getMuiTheme()}> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setIsAction("ADD");
              setOpen(true);
            }}
          >
            <Icon>add_circle</Icon>&nbsp; Add a Skill Category
          </Button>
        </Grid>
        <Grid item xs={12}>
          {skillCategories && skillCategories.length > 0 ? (
            <MUIDataTable
              title=""
              data={skillCategories}
              columns={columns}
              options={options}
            />
          ) : null}
        </Grid>
      </Grid>
      {/* </MuiThemeProvider> */}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {isAction === "ADD" ? (
            "Add new Skill Category"
          ) : isAction === "UPDATE" ? (
            <TextField
              id="modal_title_skill_cat_desc"
              label="Skill Category Description"
              variant="outlined"
              defaultValue={modalTitleSkillCatDescRef.current}
              onChange={(event) =>
                (modalTitleSkillCatDescRef.current = event.target.value)
              }
            />
          ) : (
            "Modal Title"
          )}
        </DialogTitle>
        <DialogContent dividers>
          {isAction === "ADD"
            ? contentForCreatingSkillCategory()
            : isAction === "UPDATE"
            ? contentForAddingSkillsOnSkillCategory()
            : null}
        </DialogContent>
        {isAction === "UPDATE" ? (
          <DialogActions>
            <Button onClick={handleUpdateSkillCategory} color="primary">
              Save changes
            </Button>
            <Button onClick={handleDeleteSkillCategory} color="primary">
              Delete
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    </>
  ) : null;
}

const mapStateToProps = (state) => ({
  skillCategories: state.skillCategories,
  childSkills: state.childSkills,
});

export default connect(mapStateToProps, {
  getSkillCategories,
  getChildSkills,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkill,
  deleteSkill,
})(SkillsCategoryManagement);
