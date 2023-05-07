//#region Imports
import React, { useState, useEffect } from "react";

import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  TextField,
} from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";

import MUIDataTable from "mui-datatables";
import axios from "axios";

import EditRounded from "@material-ui/icons/EditRounded";
import DeleteRounded from "@material-ui/icons/DeleteRounded";
import AddCircle from "@material-ui/icons/AddCircle";

import { createTheme } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core";
import theme from "../theme/theme";

import AddIdealProficiency from "./Dialog/CRUDIdealProficiency";
//#endregion Imports

function ManageIdealProficiency() {
  //#region Initalization

  const [jobFamily, setJobFamily] = useState([]);
  const [jobFamilyValue, setJobFamilyValue] = useState(null);
  const [jobFamilyInputValue, setJobFamilyInputValue] = useState("");

  const [jobCategory, setJobCategory] = useState([]);
  const [jobCategoryValue, setJobCategoryValue] = useState(null);
  const [jobCategoryInputValue, setJobCategoryInputValue] = useState("");

  const [jobProfile, setJobProfile] = useState([]);
  const [jobProfileValue, setJobProfileValue] = useState(null);
  const [jobProfileInputValue, setJobProfileInputValue] = useState("");

  const [idealProficiency, setIdealProficiency] = useState([]);

  const [dataToEditDelete, setDataToEditDelete] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  //#endregion Initialization

  //#region Columns Material UI Data Table
  const columns = [
    {
      name: "ideal_proficiency_id",
      label: "Ideal Proficiency Id",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },

    {
      name: "skill_id",
      label: "Skill Id",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "skill_desc",
      label: "Skills",
      options: {
        filter: false,
        sort: true,
        display: true,
      },
    },
    {
      name: "proficiency_id",
      label: "Proficiency Id",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "proficiency_desc",
      label: "Proficiency Level",
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <ActionButton tableMeta={tableMeta.rowData} />;
        },
        filter: false,
      },
    },
  ];
  //#endregion Columns Material UI Data Table

  //#region Component
  const CustomToolBar = ({ addSkillProficiency }) => {
    return (
      <Tooltip title={"Add Ideal Proficiency"}>
        <IconButton
          onClick={addSkillProficiency}
          color="primary"
          style={{ order: -1 }}
        >
          <AddCircle />
        </IconButton>
      </Tooltip>
    );
  };

  const ActionButton = ({ tableMeta }) => {
    return (
      <>
        <Box component="span">
          <Tooltip title="Edit">
            <Button
              onClick={() => editSkillProficiency(tableMeta)}
              variant="outlined"
              color="primary"
            >
              <EditRounded />
            </Button>
          </Tooltip>
        </Box>
        <Box component="span" mx={1}>
          <Tooltip title="Delete">
            <Button
              onClick={() => deleteSkillProficiency(tableMeta)}
              variant="outlined"
              color="primary"
            >
              <DeleteRounded />
            </Button>
          </Tooltip>
        </Box>
      </>
    );
  };
  //#endregion

  //#region Options for Material UI Data Table
  const options = {
    responsive: "standard",
    selectableRows: "none",
    sortFilterList: true,
    customToolbar: () => {
      return <CustomToolBar addSkillProficiency={addSkillProficiency} />;
    },
  };
  //#endregion Options for Material UI Data Table

  //#region Theme
  const getMuiTheme = () =>
    createTheme({
      ...theme,
      overrides: {
        MUIDataTableToolbar: {
          actions: {
            display: "flex",
            flexDirection: "row",
            flex: "initial",
          },
        },
      },
    });
  //#endregion Theme

  //#region Lifecycle method
  useEffect(() => {
    axios.get("/api/tm/getJobFamily").then(({ data }) => {
      setJobFamily(data.data);
    });
  }, []);

  useEffect(() => {
    getIdealProficiency(jobProfileValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, action]);

  // useEffect(() => {
  //   changeTableData();
  // }, [isOpen, action, isLoading]);

  //#endregion Lifecycle method

  //#region Functions

  // const changeTableData = () => {
  //   let newRows = idealProficiency;
  //   newRows.forEach((row) => (row[0] += "1"));
  //   setIdealProficiency(newRows);
  // };

  //For dialog box
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(!isOpen);
    setAction("");
  };

  const addSkillProficiency = () => {
    handleOpen();
    setAction("Add");
  };

  const editSkillProficiency = (tableMeta) => {
    handleOpen();
    setDataToEditDelete(tableMeta);
    setAction("Edit");
  };

  const deleteSkillProficiency = (tableMeta) => {
    handleOpen();
    setDataToEditDelete(tableMeta);
    setAction("Delete");
  };
  //Will execute when user interact with ***JOB FAMILY*** drop down list
  const getJobCategory = (newValue) => {
    const jobFamilyId = newValue && newValue.job_family_id;

    setIdealProficiency([]);
    setJobCategory([]);
    setJobProfile([]);
    setJobCategoryInputValue("");
    setJobProfileInputValue("");

    setJobFamilyValue(newValue);

    axios
      .get(`/api/mgr/admin/getJobCategory/jobFamily/${jobFamilyId}`)
      .then(({ data }) => {
        setJobCategory(data.data);
      });
  };

  //Will execute when user interact with ***JOB CATEGORY*** drop down list
  const getJobProfile = (newValue) => {
    const jobFamilyId = newValue && newValue.job_family_id;
    const jobCategoryId = newValue && newValue.job_category_id;

    setIdealProficiency([]);
    setJobProfile([]);
    setJobProfileInputValue("");

    setJobCategoryValue(newValue);

    // Will execute if there is a selected item in the dropdown list
    newValue &&
      axios
        .get(
          `/api/mgr/admin/getJobFamily/jobFamily/${jobFamilyId}/jobCategoryId/${jobCategoryId}`
        )
        .then(({ data }) => {
          setJobProfile(data.data);
        });
  };

  //Will execute when user interact with ***JOB PROFILE*** drop down list
  const getIdealProficiency = (newValue) => {
    const jobFamilyId = newValue && newValue.job_family_id;
    const jobCategoryId = newValue && newValue.job_category_id;
    const jobProfileId = newValue && newValue.job_profile_id;

    setJobProfileValue(newValue);
    // setIsLoading(true);
    axios
      .get(
        `/api/mgr/admin/getIdealProficiency/jobFamily/${jobFamilyId}/jobCategory/${jobCategoryId}/jobProfile/${jobProfileId}`
      )
      .then(({ data }) => {
        setIdealProficiency([...data.data]);
        // setIsLoading(false);
      });
  };

  //#endregion Functions

  //#region States and Props to drill
  const propsAndState = {
    handleClose,
    setIsOpen,
    isOpen,
    jobProfileValue,
    dataToEditDelete,
    action,
  };
  //#endregion States and Props to drill

  return (
    <>
      <MuiThemeProvider theme={getMuiTheme()}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Box mx={5} mb={5} mt={2}>
              <Autocomplete
                size="small"
                disabled={jobFamily ? false : true}
                value={jobFamilyValue}
                onChange={(_, newValue) => getJobCategory(newValue)}
                inputValue={jobFamilyInputValue}
                onInputChange={(_, newInputValue) => {
                  setJobFamilyInputValue(newInputValue);
                }}
                options={jobFamily}
                getOptionLabel={(option) => option.job_family_name}
                getOptionSelected={(option, value) =>
                  option.job_family_id === value.job_family_id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Family"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box mx={5} mb={5} mt={2}>
              <Autocomplete
                size="small"
                disabled={jobCategory.length ? false : true}
                value={jobCategoryValue}
                onChange={(_, newValue) => getJobProfile(newValue)}
                options={jobCategory}
                inputValue={jobCategoryInputValue}
                onInputChange={(_, newInputValue) => {
                  setJobCategoryInputValue(newInputValue);
                }}
                getOptionLabel={(option) => option.job_category_name}
                getOptionSelected={(option, value) =>
                  option.category_id === value.category_id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Category"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box mx={5} mb={5} mt={2}>
              <Autocomplete
                size="small"
                disabled={jobProfile.length ? false : true}
                value={jobProfileValue}
                onChange={(_, newValue) => getIdealProficiency(newValue)}
                options={jobProfile}
                inputValue={jobProfileInputValue}
                onInputChange={(_, newInputValue) => {
                  setJobProfileInputValue(newInputValue);
                }}
                getOptionLabel={(option) => option.job_profile_name}
                getOptionSelected={(option, value) =>
                  option.profile_id === value.profile_id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Profile"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box mx={5} mb={5} mt={2}>
            {jobProfileValue ? (
              <MUIDataTable
                m={3}
                title=""
                data={idealProficiency}
                columns={columns}
                options={options}
              />
            ) : null}
          </Box>
        </Grid>
        <AddIdealProficiency propsAndState={propsAndState} />
      </MuiThemeProvider>
    </>
  );
}

export default ManageIdealProficiency;
