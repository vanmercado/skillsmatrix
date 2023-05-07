import React, { useState, useEffect, useCallback } from "react";

import axios from "axios";

import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MUIDataTable from "mui-datatables";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

const Skillset = () => {
  const [allSkill, setAllSkill] = useState([]);
  const [teamMemberWithSkill, setTeamMemberWithSkill] = useState([]);

  const [chipData, setChipData] = useState([]);
  const [skillChip, setSkillChip] = useState([]);

  const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.skill_id !== chipToDelete.skill_id)
    );
    setSkillChip((chips) =>
      chips.filter((chip) => chip !== chipToDelete.skill_id)
    );
  };

  const skills = useSelector((state) => state.skills);

  useEffect(() => {
    setAllSkill(skills);
  }, []);

  const getTeamMemberWithSkill = (newValue) => {
    const newChip = newValue;
    if (newChip !== null) {
      if (!chipData.includes(newChip)) {
        setChipData([...chipData, newChip]);
        setSkillChip([...skillChip, newChip.skill_id]);
      }
    }
  };

  useEffect(() => {
    if (skillChip.length !== 0) {
      axios.get(`/api/mgr/admin/skillset/${skillChip}`).then(({ data }) => {
        setTeamMemberWithSkill(data.data);
      });
    }
  }, [chipData]);

  const columns = [
    {
      name: "tm_id",
      label: "Workday ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "tm_name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "job_profile_name",
      label: "Job Profile",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "proficiency",
      label: "Proficiency",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "status",
      label: "Approval Status",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "skill_desc",
      label: "Skill",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const options = {
    responsive: "standard",
    selectableRows: "none",
    sortFilterList: true,
  };

  const handleKeyPress = useCallback((event) => {
    if (event.key === "Escape") {
      setChipData([]);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <Grid item xs>
        <Autocomplete
          id="skills"
          getOptionLabel={(allSkill) => `${allSkill.skill_desc}`}
          options={allSkill}
          onChange={(_, newValue) => getTeamMemberWithSkill(newValue)}
          isOptionEqualToValue={(option, value) =>
            option.skill_desc === value.skill_desc
          }
          noOptionsText="No results found"
          style={{ width: "50%", marginTop: "15px", marginBottom: "10px" }}
          renderInput={(params) => (
            <TextField {...params} label="Select Skill" variant="outlined" />
          )}
        />

        <Paper
          elevation={0}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            listStyle: "none",
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {chipData.map((data) => {
            return (
              <ListItem>
                <Chip label={data.skill_desc} onDelete={handleDelete(data)} />
              </ListItem>
            );
          })}
        </Paper>

        {chipData.length !== 0 ? (
          <MUIDataTable
            title=""
            data={teamMemberWithSkill}
            columns={columns}
            options={options}
          />
        ) : null}
      </Grid>
    </>
  );
};

export default Skillset;
