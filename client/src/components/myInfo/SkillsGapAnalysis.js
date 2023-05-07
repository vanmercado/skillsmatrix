import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid, TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

import { useSelector } from "react-redux";

import axios from "axios";

import Chart from "./Chart/SkillsGapAnalysisGraph";

function SkillsGapAnaylsis() {
  //#region initialization
  const teamMemberId = useSelector((state) => state.tmInfo.tm_id);
  const [jobFamily, setJobFamily] = useState([]);
  const [jobFamilyValue, setJobFamilyValue] = useState(null);
  const [jobFamilyInputValue, setJobFamilyInputValue] = useState("");

  const [jobLevel, setJobLevel] = useState([]);
  const [jobLevelValue, setJobLevelValue] = useState(null);
  const [jobLevelInputValue, setJobLevelInputValue] = useState("");

  const [jobProfile, setJobProfile] = useState([]);
  const [jobProfileValue, setJobProfileValue] = useState(null);
  const [jobProfileInputValue, setJobProfileInputValue] = useState("");

  const [jobCategory, setJobCategory] = useState([]);
  const [jobCategoryValue, setJobCategoryValue] = useState(null);
  const [jobCategoryInputValue, setJobCategoryInputValue] = useState("");

  const [skillData, setSkillData] = useState([]);

  //#endregion initionalization

  //#region lifecycle method
  useEffect(() => {
    axios.get("/api/tm/getJobFamily").then(({ data }) => {
      setJobFamily(data.data);
    });
  }, []);
  //#endregion lifecycle method

  //#region Functions
  //Will execute when user interact with ***JOB FAMILY*** drop down list
  const getJobLevel = (newValue) => {
    const jobFamilyId = newValue && newValue.job_family_id;

    setSkillData([]);
    setJobLevel([]);
    setJobProfile([]);
    setJobCategory([]);

    setJobLevelInputValue("");
    setJobProfileInputValue("");
    setJobCategoryInputValue("");

    setJobFamilyValue(newValue);

    //Will execute if there is a selected item in the dropdown list
    newValue &&
      axios
        .get(`/api/tm/getJobLevel/jobFamilyId/${jobFamilyId}`)
        .then(({ data }) => {
          setJobLevel(data.data);
        });
  };
  //Will execute when user interact with ***JOB LEVEL*** drop down list
  const getJobProfile = (newValue) => {
    const jobFamilyId = newValue && newValue.job_family_id;
    const jobLevel = newValue && newValue.job_level;

    setSkillData([]);
    setJobProfile([]);
    setJobCategory([]);

    setJobProfileInputValue("");
    setJobCategoryInputValue("");

    setJobLevelValue(newValue);

    //Will execute if there is a selected item in the dropdown list
    newValue &&
      axios
        .get(
          `/api/tm/getJobProfile/jobFamilyId/${jobFamilyId}/jobLevel/${jobLevel}`
        )
        .then(({ data }) => {
          setJobProfile(data.data);
        });
  };

  //Will execute when user interact with ***JOB PROFILE*** drop down list
  const getJobCategory = (newValue) => {
    const jobProfileId = newValue && newValue.job_profile_id;

    axios
      .get(`/api/tm/getJobProfile/jobProfileId/${jobProfileId}`)
      .then(({ data }) => {
        //Remove the baseline job category
        setJobCategory(data.data.filter((item) => item.job_category_id !== 0));
      });
  };

  //Will execute when user interact with ***JOB PROFILE*** drop down list
  const getIdealProficiency = (newValue) => {
    const isJobCategoryIdExist =
      newValue && newValue.hasOwnProperty("job_category_id");
    const jobProfileId = newValue && newValue.job_profile_id;
    let jobCategoryId = isJobCategoryIdExist ? newValue.job_category_id : null;

    setSkillData([]);

    if (isJobCategoryIdExist) {
      setJobCategoryValue(newValue);
    } else {
      setJobCategory([]);
      setJobCategoryInputValue("");
      setJobProfileValue(newValue);
      getJobCategory(newValue);
    }

    //Will execute if there is a selected item in the dropdown list
    newValue &&
      axios
        .get(
          `/api/tm/getJobProfile/jobProfileId/${jobProfileId}/jobCategoryId/${jobCategoryId}/teamMemberId/${teamMemberId}`
        )
        .then(({ data }) => {
          setSkillData(data.data);
          // console.log(data.data);
        });
  };
  //#endregion Functions

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Autocomplete
            size="small"
            disabled={jobFamily ? false : true}
            value={jobFamilyValue}
            onChange={(_, newValue) => getJobLevel(newValue)}
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
              <TextField {...params} label="Job Family" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            size="small"
            disabled={jobLevel.length ? false : true}
            value={jobLevelValue}
            onChange={(_, newValue) => getJobProfile(newValue)}
            options={jobLevel}
            inputValue={jobLevelInputValue}
            onInputChange={(_, newInputValue) => {
              setJobLevelInputValue(newInputValue);
            }}
            getOptionLabel={(option) => option.job_level}
            getOptionSelected={(option, value) =>
              option.job_level === value.job_level
            }
            renderInput={(params) => (
              <TextField {...params} label="Job Level" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={3}>
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
              <TextField {...params} label="Job Profile" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            size="small"
            disabled={jobCategory.length ? false : true}
            value={jobCategoryValue}
            onChange={(_, newValue) => getIdealProficiency(newValue)}
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
              <TextField {...params} label="Job Category" variant="outlined" />
            )}
          />
        </Grid>
      </Grid>
      <Grid>
        {skillData.length ? (
          <Chart skillsData={skillData} />
        ) : jobFamilyInputValue !== "" &&
          jobLevelInputValue !== "" &&
          jobProfileInputValue !== "" &&
          skillData.length === 0 ? (
          <Grid item xs={4}>
            <br />
            <Paper elevation={8}>
              <Box
                p={4}
                style={{
                  textAlign: "left",
                  lineHeight: "1.8",
                }}
              >
                <h3
                  style={{
                    fontFamily: "HelveticaNeueLTStd-Lt",
                  }}
                >
                  There is no baseline for this job profile yet
                </h3>
              </Box>
            </Paper>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
}

export default SkillsGapAnaylsis;
