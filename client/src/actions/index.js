import axios from "axios";

import {
  SET_NOFICATION_VALUE,
  GET_TM_INFO,
  GET_TM_TECH_INFO,
  GET_TM_POSITION,
  GET_TM_TIDS_INFO,
  GET_TM_TEAM_ASSOC,
  GET_SKILLS,
  GET_PROFICIENCIES,
  CREATE_TM_PROFICIENCY,
  UPDATE_TM_PROFICIENCY,
  DELETE_TM_PROFICIENCY,
  GET_JOB_ROLES_CURRENT_TEAM,
  GET_SKILLS_GAP_CURRENT_ROLE,
  GET_SKILLS_GAP_SELECTED_ROLE,
  GET_TEAM_SNAPSHOT,
  GET_TL_TEAM_INFO,
  GET_TL_TEAM_MEMBER_COUNT,
  GET_TL_TEAM_SKILLSGAP,
  GET_PROFICIENCY_APPROVAL_REQUESTS,
  GET_TEAM_NAMES,
  GET_TEAM_LEAD_NAMES,
  GET_RESOURCE_COUNT_PER_SKILL,
  GET_PROFICIENCY_COUNT_PER_SKILL,
  GET_PIVOT_GENERATOR_DATA,
  GET_HR_TA_INFO,
  GET_SKILL_CATEGORIES,
  GET_CHILD_SKILLS,
  CREATE_SKILL_CATEGORY,
  UPDATE_SKILL_CATEGORY,
  DELETE_SKILL_CATEGORY,
  CREATE_SKILL,
  DELETE_SKILL,
  GET_TEAMS,
  GET_TEAM_MEMBERS,
  GET_ADMIN_SKILLS_GAP,
  UPDATE_TEAM_SNAPSHOT,
  GET_TEAM_JOBROLE_MANAGER,
  GET_TEAM_JOBROLE_SKILL_PROFICIENCY,
  UPDATE_SKILL_PROFICIENCY,
  ADD_SKILL_PROFICIENCY,
  DELETE_SKILL_PROFICIENCY,
  GET_FA_SNAPSHOT,
  UPDATE_FA_SNAPSHOT,
  GET_FAS,
  ADD_LOGIN_DATA,
  GET_LOGIN_DATA,
  GET_ALL_TM_TECH_INFO,
  GET_TEAM_MEMBERS_WITH_SKILL,
} from "./types";

//Notifications

export const setNotificationState = (value) => {
  return {
    type: SET_NOFICATION_VALUE,
    value: value,
  };
};

//#region Region for axios call related to Team Members
export const getTmInfo = (data) => async (dispatch) => {
  const res = await axios.post("/api/tm/info", data);
  dispatch({
    type: GET_TM_INFO,
    payload: res.data,
  });
};

export const getTmTechInfo = (data) => async (dispatch) => {
  const res = await axios.post("/api/tm/techInfo", data);
  dispatch({
    type: GET_TM_TECH_INFO,
    payload: res.data,
  });
};

export const getTmPosition = (data) => async (dispatch) => {
  const res = await axios.post("/api/tm/position", data);
  dispatch({
    type: GET_TM_POSITION,
    payload: res.data[0],
  });
};

export const getTmTidsInfo = (data) => async (dispatch) => {
  const res = await axios.post("/api/tm/tids/info", data);
  dispatch({
    type: GET_TM_TIDS_INFO,
    payload: res.data,
  });
};

export const getTmTeamAssoc = (data) => async (dispatch) => {
  const res = await axios.post("/api/tm/teamAssoc", data);
  dispatch({
    type: GET_TM_TEAM_ASSOC,
    payload: res.data,
  });
};

export const getSkills = () => async (dispatch) => {
  const res = await axios.get("/api/tm/skills");
  dispatch({
    type: GET_SKILLS,
    payload: res.data,
  });
};

export const getProficiencies = () => async (dispatch) => {
  const res = await axios.get("/api/tm/proficiencies");
  dispatch({
    type: GET_PROFICIENCIES,
    payload: res.data,
  });
};

export const createTmProficiency = (data) => async (dispatch) => {
  const res = await axios.post("/api/tm/proficiency/create", data);
  dispatch({
    type: CREATE_TM_PROFICIENCY,
    payload: res.data,
  });
};

export const updateTmProficiency = (data) => async (dispatch) => {
  const res = await axios.put("/api/tm/proficiency/update", data);
  dispatch({
    type: UPDATE_TM_PROFICIENCY,
    payload: res.data,
  });
};

export const deleteTmProficiency = (data) => async (dispatch) => {
  const res = await axios.delete("/api/tm/proficiency/delete", { data: data });
  dispatch({
    type: DELETE_TM_PROFICIENCY,
    payload: res.data,
  });
};

export const getJobRolesCurrentTeam = (data) => async (dispatch) => {
  const res = await axios.post("/api/tm/jobRoles/currentTeam", data);
  dispatch({
    type: GET_JOB_ROLES_CURRENT_TEAM,
    payload: res.data,
  });
};

export const getSkillsGapCurrentRole = (data) => async (dispatch) => {
  const res = await axios.post(
    "/api/tm/skillsGap/currentTeam/currentRole",
    data
  );
  dispatch({
    type: GET_SKILLS_GAP_CURRENT_ROLE,
    payload: res.data,
  });
};

export const getSkillsGapSelectedRole = (data) => async (dispatch) => {
  const res = await axios.post(
    "/api/tm/skillsGap/currentTeam/selectedRole",
    data
  );
  dispatch({
    type: GET_SKILLS_GAP_SELECTED_ROLE,
    payload: res.data,
  });
};

export const getTeamSnapshot = (data) => async (dispatch) => {
  const res = await axios.post("/api/tm/team/snapshot", data);
  dispatch({
    type: GET_TEAM_SNAPSHOT,
    payload: res.data,
  });
};
//#endregion

//#region Region for axios call related to Team Leads
export const getTlTeamInfo = (data) => async (dispatch) => {
  const res = await axios.post("/api/tl/teamInfo", data);
  dispatch({
    type: GET_TL_TEAM_INFO,
    payload: res.data,
  });
};

export const getTlTeamMemberCount = (data) => async (dispatch) => {
  const res = await axios.post("/api/tl/teamMemberCount", data);
  dispatch({
    type: GET_TL_TEAM_MEMBER_COUNT,
    payload: res.data,
  });
};

export const getTlTeamSkillsGap = (data) => async (dispatch) => {
  const res = await axios.post("/api/tl/teamSkillsGap", data);
  dispatch({
    type: GET_TL_TEAM_SKILLSGAP,
    payload: res.data,
  });
};

export const getProficiencyApprovalRequests = (data) => async (dispatch) => {
  const res = await axios.post("/api/tl/proficiencyApprovalRequests", data);
  dispatch({
    type: GET_PROFICIENCY_APPROVAL_REQUESTS,
    payload: res.data,
  });
};
//#endregion

//#region Region for axios call related to Managers
export const getTeamNames = () => async (dispatch) => {
  const res = await axios.get("/api/mgr/teamNames");
  dispatch({
    type: GET_TEAM_NAMES,
    payload: res.data,
  });
};

export const getTeamLeadNames = () => async (dispatch) => {
  const res = await axios.get("/api/mgr/teamLeadNames");
  dispatch({
    type: GET_TEAM_LEAD_NAMES,
    payload: res.data,
  });
};

export const getResourceCountPerSkill = (data) => async (dispatch) => {
  const res = await axios.post("/api/mgr/reports/resourceCountPerSkill", data);
  dispatch({
    type: GET_RESOURCE_COUNT_PER_SKILL,
    payload: res.data,
  });
};

export const getProficiencyCountPerSkill = (data) => async (dispatch) => {
  const res = await axios.post(
    "/api/mgr/reports/proficiencyCountPerSkill",
    data
  );
  dispatch({
    type: GET_PROFICIENCY_COUNT_PER_SKILL,
    payload: res.data,
  });
};

export const getPivotGeneratorData = () => async (dispatch) => {
  const res = await axios.get("/api/mgr/reports/pivotGeneratorData");
  dispatch({
    type: GET_PIVOT_GENERATOR_DATA,
    payload: res.data,
  });
};

export const getHrTaInfo = (data) => async (dispatch) => {
  const res = await axios.post("/api/mgr/admin/hrta", data);
  dispatch({
    type: GET_HR_TA_INFO,
    payload: res.data,
  });
};

export const getSkillCategories = () => async (dispatch) => {
  const res = await axios.get("/api/mgr/admin/skillCategories");
  dispatch({
    type: GET_SKILL_CATEGORIES,
    payload: res.data,
  });
};

export const getChildSkills = (data) => async (dispatch) => {
  const res = await axios.post("/api/mgr/admin/skillCategory/skills", data);
  dispatch({
    type: GET_CHILD_SKILLS,
    payload: res.data,
  });
};

export const createSkillCategory = (data) => async (dispatch) => {
  const res = await axios.post("/api/mgr/admin/skillCategory/create", data);
  dispatch({
    type: CREATE_SKILL_CATEGORY,
    payload: res.data,
  });
};

export const updateSkillCategory = (data) => async (dispatch) => {
  const res = await axios.put("/api/mgr/admin/skillCategory/update", data);
  dispatch({
    type: UPDATE_SKILL_CATEGORY,
    payload: res.data,
  });
};

export const deleteSkillCategory = (data) => async (dispatch) => {
  const res = await axios.delete("/api/mgr/admin/skillCategory/delete", {
    data: data,
  });
  dispatch({
    type: DELETE_SKILL_CATEGORY,
    payload: res.data,
  });
};

export const createSkill = (data) => async (dispatch) => {
  const res = await axios.post("/api/mgr/admin/skill/create", data);
  dispatch({
    type: CREATE_SKILL,
    payload: res.data,
  });
};

export const deleteSkill = (data) => async (dispatch) => {
  const res = await axios.delete("/api/mgr/admin/skill/delete", { data: data });
  dispatch({
    type: DELETE_SKILL,
    payload: res.data,
  });
};

export const getTeams = () => async (dispatch) => {
  const res = await axios.get("/api/mgr/admin/teams");
  dispatch({
    type: GET_TEAMS,
    payload: res.data,
  });
};

export const getTeamMembers = () => async (dispatch) => {
  const res = await axios.get("/api/mgr/admin/teamMembers");
  dispatch({
    type: GET_TEAM_MEMBERS,
    payload: res.data,
  });
};

export const getAdminSkillsGap = (data) => async (dispatch) => {
  const res = await axios.post("/api/mgr/admin/skillsGap", data);
  dispatch({
    type: GET_ADMIN_SKILLS_GAP,
    payload: res.data,
  });
};

export const updateTeamSnapshot = (data) => async (dispatch) => {
  const res = await axios.put("/api/mgr/admin/teamSnapshot/update", data);
  dispatch({
    type: UPDATE_TEAM_SNAPSHOT,
    payload: res.data,
  });
};

export const getTeamJobRoleManager = () => async (dispatch) => {
  const res = await axios.get("/api/mgr/admin/teamJobRoleManager");
  dispatch({
    type: GET_TEAM_JOBROLE_MANAGER,
    payload: res.data,
  });
};

export const getTeamJobRoleSkillProficiency = (data) => async (dispatch) => {
  const res = await axios.post(
    "/api/mgr/admin/teamJobRoleSkillProficiency",
    data
  );
  dispatch({
    type: GET_TEAM_JOBROLE_SKILL_PROFICIENCY,
    payload: res.data,
  });
};

export const updateSkillProficiency = (data) => async (dispatch) => {
  const res = await axios.patch(
    "/api/mgr/admin/teamJobRoleSkillProficiency",
    data
  );
  dispatch({
    type: UPDATE_SKILL_PROFICIENCY,
    payload: res.data,
  });
};

export const addSkillProficiency = (data) => async (dispatch) => {
  const res = await axios.post(
    "/api/mgr/admin/teamJobRoleIdealProficiency",
    data
  );
  dispatch({
    type: ADD_SKILL_PROFICIENCY,
    payload: res.data,
  });
};

export const deleteSkillProficiency = (data) => async (dispatch) => {
  const res = await axios.delete("/api/mgr/admin/teamJobRoleIdealProficiency", {
    data: data,
  });
  dispatch({
    type: DELETE_SKILL_PROFICIENCY,
    payload: res.data,
  });
};

//#endregion

//#region FUNCTIONAL AREA SNAPSHOT
export const getFaSnapshot = (data) => async (dispatch) => {
  const res = await axios.post("/api/tm/fa/snapshot", data);
  dispatch({
    type: GET_FA_SNAPSHOT,
    payload: res.data,
  });
};

export const updateFaSnapshot = (data) => async (dispatch) => {
  const res = await axios.put("/api/mgr/admin/faSnapshot/update", data);
  dispatch({
    type: UPDATE_FA_SNAPSHOT,
    payload: res.data,
  });
};

export const getFas = () => async (dispatch) => {
  const res = await axios.get("/api/mgr/admin/fas");
  dispatch({
    type: GET_FAS,
    payload: res.data,
  });
};

//#end region FUNCTIONAL AREA SNAPSHOT

//#region LOGGER
export const addLoginData = (data) => async (dispatch) => {
  const dataTosend = { sid: data.sid, email: data.email };
  const res = await axios.post("/api/mgr/admin/logger", dataTosend);
  dispatch({
    type: ADD_LOGIN_DATA,
    payload: res.data,
  });
};

export const getLoginData = (data) => async (dispatch) => {
  const res = await axios.get("/api/mgr/admin/logger");
  dispatch({
    type: GET_LOGIN_DATA,
    payload: res.data,
  });
};

export const getTeamMembersWithSkill = (data) => async (dispatch) => {
  const res = await axios.get("/api/mgr/admin/skillset/:skill", data);
  dispatch({
    type: GET_TEAM_MEMBERS_WITH_SKILL,
    payload: res.data,
  });
};

//#endregion LOGGER

//#region All Tech Info
export const getAllTmTechInfo = (data) => async (dispatch) => {
  const res = await axios.get("/api/tm/allTechInfo");
  dispatch({
    type: GET_ALL_TM_TECH_INFO,
    payload: res.data,
  });
};

//#endregion All Tech Info
