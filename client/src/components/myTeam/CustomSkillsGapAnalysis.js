import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import { Grid } from "@material-ui/core";
import { getTlTeamInfo } from "../../actions";
import { connect } from "react-redux";
import Chart from "./Chart/CustomSkillsGapAnaylsisGraph";

function CustomSkillsGapAnaylsis(props) {
  const { profile, getTlTeamInfo, teamInfo } = props;

  const [teamMemberValue, setTeamMemberValue] = useState(null);
  const [teamMemberInputValue, setTeamMemberInputValue] = useState("");

  const [tmId, setTmId] = useState([]);
  const [jobCategoryParams, setJobCategoryParams] = useState("");

  const [jobFamily, setJobFamily] = useState([]);
  const [jobFamilyValue, setJobFamilyValue] = useState(null);
  const [jobFamilyInputValue, setJobFamilyInputValue] = useState("");

  const [jobCategory, setJobCategory] = useState([]);
  const [jobCategoryValue, setJobCategoryValue] = useState(null);
  const [jobCategoryInputValue, setJobCategoryInputValue] = useState("");

  const [jobProfile, setJobProfile] = useState([]);
  const [jobProfileValue, setJobProfileValue] = useState(null);
  const [jobProfileInputValue, setJobProfileInputValue] = useState("");

  const [skillsData, setSkillData] = useState([]);

  useEffect(() => {
    axios.get("/api/tm/getJobFamily").then(({ data }) => {
      setJobFamily(data.data);
    });
  }, []);

  useEffect(() => {
    if (profile) {
      getTlTeamInfo({ email: profile.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (tmId) {
    }
  }, [tmId]);

  //Will execute when user interact with ***JOB FAMILY*** drop down list
  const getTeamMember = (newValue) => {
    const tm_id = newValue && newValue.tm_id;

    setJobCategory([]);
    setJobProfile([]);
    setSkillData([]);
    setJobFamilyInputValue("");
    setJobCategoryInputValue("");
    setJobProfileInputValue("");
    setTmId(tm_id);
    setTeamMemberValue(newValue);
  };

  //Will execute when user interact with ***JOB FAMILY*** drop down list
  const getJobCategory = (newValue) => {
    const jobFamilyId = newValue && newValue.job_family_id;

    setJobCategory([]);
    setJobProfile([]);
    setJobCategoryInputValue("");
    setJobProfileInputValue("");
    setJobFamilyValue(newValue);
    setSkillData([]);
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
    setSkillData([]);
    setJobProfile([]);
    setJobProfileInputValue("");
    setJobCategoryValue(newValue);
    setJobCategoryParams(jobCategoryId);
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

  const getIdealProficiency = (newValue) => {
    const jobProfileId = newValue && newValue.job_profile_id;
    // const jobCategoryId = newValue && newValue.job_category_id;

    setSkillData([]);
    setJobProfileValue(newValue);

    //Will execute if there is a selected item in the dropdown list
    newValue &&
      axios
        .get(
          `/api/mgr/admin/jobProfile/${jobProfileId}/jobCategory/${jobCategoryParams}/tmId/${tmId}`
        )
        .then(({ data }) => {
          setSkillData(data.data);
        });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Autocomplete
            size="small"
            disabled={teamInfo ? false : true}
            value={teamMemberValue}
            onChange={(_, newValue) => {
              getTeamMember(newValue);
            }}
            inputValue={teamMemberInputValue}
            onInputChange={(_, newInputValue) => {
              setTeamMemberInputValue(newInputValue);
            }}
            //team members under this user
            options={teamInfo}
            getOptionLabel={(option) => option.tm_name}
            getOptionSelected={(option, value) => option.tm_id === value.tm_id}
            renderInput={(params) => (
              <TextField {...params} label="Team Member" variant="outlined" />
            )}
          />
        </Grid>

        <Grid item xs={3}>
          <Autocomplete
            size="small"
            //if selected a teammember
            disabled={teamMemberValue ? false : true}
            value={jobFamilyValue}
            onChange={(_, newValue) => getJobCategory(newValue)}
            inputValue={jobFamilyInputValue}
            onInputChange={(_, newInputValue) => {
              setJobFamilyInputValue(newInputValue);
            }}
            //all job family
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
            //if jobcategory has elements after API call
            disabled={jobCategory.length ? false : true}
            value={jobCategoryValue}
            onChange={(_, newValue) => getJobProfile(newValue)}
            //filtered category by family
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
        <Grid item xs={3}>
          <Autocomplete
            size="small"
            //if jobprofile has elements after API call
            disabled={jobProfile.length ? false : true}
            value={jobProfileValue}
            onChange={(_, newValue) => getIdealProficiency(newValue)}
            //filtered by family and category
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
      </Grid>
      <Grid>
        {skillsData.length ? <Chart skillsData={skillsData} /> : null}
      </Grid>
    </>
  );
}
const mapStateToProps = (state) => ({ teamInfo: state.teamInfo });

export default connect(mapStateToProps, { getTlTeamInfo })(
  CustomSkillsGapAnaylsis
);
