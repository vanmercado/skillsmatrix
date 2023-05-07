import React, { useEffect, useRef, useState } from "react";

import { Grid, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import BarCharts from "./chart/BarCharts";
import DataTable from "./DataTable";
import axios from "axios";

const columns = [
  {
    name: "tm_id",
    label: "Workday ID",
    options: {
      filter: true,
      display: true,
    },
  },
  {
    name: "tm_name",
    label: "Name",
    options: {
      filter: true,
      display: true,
    },
  },
  {
    name: "email",
    label: "Email",
    options: {
      filter: true,
      sort: true,
      display: false,
      sortDirection: "desc",
    },
  },
  {
    name: "skill_desc",
    label: "Skills",
    options: {
      filter: true,
      sort: true,
      display: true,
      sortDirection: "desc",
    },
  },
  {
    name: "proficiency",
    label: "Proficiency",
    options: {
      filter: true,
      sort: true,
      display: true,
      sortDirection: "desc",
    },
  },
  {
    name: "status",
    label: "Status",
    options: {
      filter: true,
      sort: true,
      display: true,
      sortDirection: "desc",
    },
  },
  {
    name: "team_lead",
    label: "Supervisor",
    options: {
      filter: true,
      display: true,
    },
  },
];

export default function TMSkillStatusDashboard() {
  const [om, setOm] = useState([]);
  const [omValue, setOmValue] = useState(null);
  const [omInputValue, setOmInputValue] = useState("");

  const [teamManager, setTeamManager] = useState([]);
  const [teamManagerValue, setTeamManagerValue] = useState(null);
  const [teamManagerInputValue, setTeamManagerInputValue] = useState("");

  const [teamLead, setTeamLead] = useState([]);
  const [teamLeadValue, setTeamLeadValue] = useState(null);
  const [teamLeadInputValue, setTeamLeadInputValue] = useState("");

  const [skillStatusData, setSkillStatusData] = useState([]);
  const [skillStatusDataList, setSkillStatusDataList] = useState([]);

  const prevCountRef = useRef(skillStatusData);

  useEffect(() => {
    axios.get("/api/mgr/getTMSkillStatusCount").then(({ data }) => {
      setSkillStatusData(data.data);
    });

    axios.get("/api/mgr/dataList/getTMSkillStatus").then(({ data }) => {
      setSkillStatusDataList(data.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/mgr/getSLTList").then(({ data }) => {
      setOm(data.data);
    });
  }, []);

  //Will execute when user interact with *** Senior Leadership Team *** drop down list
  const getOManager = (newValue) => {
    const omID = newValue && newValue.tm_id;

    setSkillStatusData([]);
    setTeamManager([]);
    setTeamLead([]);

    setTeamManagerInputValue("");
    setTeamLeadInputValue("");

    setOmValue(newValue);
    newValue &&
      axios
        .get(`/api/mgr/skillStatusCount/getTMListBySLT/${omID}`)
        .then(({ data }) => {
          setTeamManager(data.data.filter((item) => item.is_role !== "member"));
          setSkillStatusData(data.data);
        });

    newValue &&
      axios.get(`/api/mgr/dataList/getTMListBySLT/${omID}`).then(({ data }) => {
        setSkillStatusDataList(data.data);
      });
  };

  //Will execute when user interact with ***Team Manager*** drop down list
  const getTeamManager = (newValue) => {
    const omID = newValue && newValue.team_lead;
    const tmID = newValue && newValue.tm_id;

    setSkillStatusData([]);
    setTeamLead([]);
    setTeamLeadInputValue("");

    setTeamManagerValue(newValue);

    newValue &&
      axios
        .get(
          `/api/mgr/skillStatusCount/getTMListBySLT/${omID}/getTMListByTM/${tmID}`
        )
        .then(({ data }) => {
          setTeamLead(data.data.filter((item) => item.is_role !== "member"));
          setSkillStatusData(data.data);
        });

    newValue &&
      axios
        .get(`/api/mgr/dataList/getTMListBySLT/${omID}/getTMListByTM/${tmID}`)
        .then(({ data }) => {
          setSkillStatusDataList(data.data);
        });
  };

  //Will execute when user interact with ***Team Lead*** drop down list
  const getTeamLead = (newValue) => {
    const tmID = newValue && newValue.team_lead;
    const tlID = newValue && newValue.tm_id;

    setSkillStatusData([]);

    setTeamLeadValue(newValue);

    newValue &&
      axios
        .get(`/api/mgr/getTMListByTM/${tmID}/getTMListByTL/${tlID}`)
        .then(({ data }) => {
          setSkillStatusData(data.data);
        });

    newValue &&
      axios
        .get(`/api/mgr/dataList/getTMListByTM/${tmID}/getTMListByTL/${tlID}`)
        .then(({ data }) => {
          setSkillStatusDataList(data.data);
        });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Autocomplete
              size="small"
              disabled={om ? false : true}
              value={omValue}
              onChange={(_, newValue) => getOManager(newValue)}
              inputValue={omInputValue}
              onInputChange={(_, newInputValue) => {
                setOmInputValue(newInputValue);
              }}
              options={om}
              getOptionLabel={(option) => option.tm_name}
              getOptionSelected={(option, value) =>
                option.tm_id === value.tm_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Senior Leadership Team"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Autocomplete
              size="small"
              disabled={teamManager.length ? false : true}
              value={teamManagerValue}
              onChange={(_, newValue) => getTeamManager(newValue)}
              inputValue={teamManagerInputValue}
              onInputChange={(_, newInputValue) => {
                setTeamManagerInputValue(newInputValue);
              }}
              options={teamManager}
              getOptionLabel={(option) => option.tm_name}
              getOptionSelected={(option, value) =>
                option.tm_id === value.tm_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Direct Supervisor"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Autocomplete
              size="small"
              disabled={teamLead.length ? false : true}
              value={teamLeadValue}
              onChange={(_, newValue) => getTeamLead(newValue)}
              inputValue={teamLeadInputValue}
              onInputChange={(_, newInputValue) => {
                setTeamLeadInputValue(newInputValue);
              }}
              options={teamLead}
              getOptionLabel={(option) => option.tm_name}
              getOptionSelected={(option, value) =>
                option.tm_id === value.tm_id
              }
              renderInput={(params) => (
                <TextField {...params} label="Team Leader" variant="outlined" />
              )}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {skillStatusData.length ? (
            <BarCharts
              data={skillStatusData}
              title={"Team Member Skill Status"}
            />
          ) : (
            <p>No Available Data</p>
          )}
        </Grid>

        <Grid item xs={12}>
          <DataTable data={skillStatusDataList} columns={columns} />
        </Grid>
      </Grid>
    </>
  );
}
