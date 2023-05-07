//#region imports
import { useEffect, useState, forwardRef } from "react";
import { useSelector } from "react-redux";
import {
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import axios from "axios";

//#endregion imports

export default function CRUDIdealProficiency({ propsAndState }) {
  //#region Initializatioin
  const { handleClose, isOpen, jobProfileValue, dataToEditDelete, action } =
    propsAndState;

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [
    idealProficiencyId,
    skillId,
    skillDesc,
    proficiencyId,
    proficiencyDesc,
  ] = dataToEditDelete;

  const [skill, setSkill] = useState([]);
  const [skillValue, setSkillValue] = useState(null);
  const [skillInputValue, setSkillInputValue] = useState("");

  const [proficiency, setProficiency] = useState([]);
  const [proficiencyValue, setProficiencyValue] = useState(null);
  const [proficiencyInputValue, setProficiencyInputValue] = useState("");

  //Redux states
  const proficiencies = useSelector((state) => state.proficiencies);
  const skills = useSelector((state) => state.skills);

  const [notification, setNotification] = useState({
    isSuccess: false,
    message: "",
  });

  //#endregion Intialization

  //#region Lifecycle Method
  useEffect(() => {
    setSkill(skills);
    setProficiency(proficiencies);
  }, [proficiencies, skills]);

  useEffect(() => {
    if (action === "Add") {
      setSkillValue(null);
      setSkillInputValue("");
      setProficiencyValue(null);
      setProficiencyInputValue("");
    } else {
      setSkillValue({
        skill_id: skillId,
        skill_desc: skillDesc,
      });

      setProficiencyValue({
        proficiency_id: proficiencyId,
        proficiency_desc: proficiencyDesc,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, notification]);
  //#endregion Lifecycle Method

  //#region Functions
  //For Nofication
  const handleCloseNofication = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, message: "", isSuccess: false });
  };

  const handleSave = () => {
    const data = {
      jobProfileId: jobProfileValue.job_profile_id,
      jobCategoryId: jobProfileValue.job_category_id,
      proficiencyId: proficiencyValue.proficiency_id,
      skillId: skillValue.skill_id,
    };

    switch (action) {
      case "Add":
        addRequest(data);
        break;
      case "Edit":
        editRequest({ ...data, idealProficiencyId });
        break;
      case "Delete":
        deleteRequest({ ...data, idealProficiencyId });
        break;
      default:
        console.log("Check your logic");
    }

    handleClose();
  };

  const addRequest = (data) => {
    axios
      .post(`/api/mgr/admin/idealProficiency`, data)
      .then(({ data }) => {
        setNotification({ message: data.message, isSuccess: data.isSuccess });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editRequest = (data) => {
    axios
      .patch(`/api/mgr/admin/idealProficiency`, data)
      .then(({ data }) => {
        setNotification({ message: "Edited", isSuccess: data.isSuccess });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteRequest = (data) => {
    axios
      .delete(`/api/mgr/admin/idealProficiency`, { data })
      .then(({ data }) => {
        setNotification({ message: "Deleted", isSuccess: data.isSuccess });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //#endregion Functions

  return (
    <div>
      <Dialog fullWidth open={isOpen} onClose={handleClose}>
        <DialogTitle>{action} Skill and Proficiency Level</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                disabled
                size="small"
                defaultValue={jobProfileValue}
                options={[jobProfileValue]}
                getOptionLabel={(option) => option.job_profile_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Profile"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disabled={action === "Add" ? false : true}
                size="small"
                value={skillValue}
                onChange={(_, newValue) => {
                  setSkillValue(newValue);
                }}
                inputValue={skillInputValue}
                onInputChange={(_, newInputValue) => {
                  setSkillInputValue(newInputValue);
                }}
                options={skill}
                getOptionLabel={(option) => option.skill_desc}
                getOptionSelected={(option, value) =>
                  option.skill_id === value.skill_id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Skills"
                    variant="outlined"
                  />
                )}
                noOptionsText="No results found"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disabled={action === "Delete" ? true : false}
                size="small"
                value={proficiencyValue}
                onChange={(_, newValue) => {
                  setProficiencyValue(newValue);
                }}
                inputValue={proficiencyInputValue}
                onInputChange={(_, newInputValue) => {
                  setProficiencyInputValue(newInputValue);
                }}
                options={proficiency}
                getOptionLabel={(option) => option.proficiency_desc}
                getOptionSelected={(option, value) =>
                  option.proficiency_id === value.proficiency_id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Proficiency Level"
                    variant="outlined"
                  />
                )}
                noOptionsText="No results found"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={skillValue && proficiencyValue ? false : true}
            onClick={handleSave}
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={notification.isSuccess}
        autoHideDuration={3000}
        onClose={handleCloseNofication}
      >
        <Alert
          onClose={handleCloseNofication}
          severity="success"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
