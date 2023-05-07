import { combineReducers } from "redux";

// Import child reducers

import notificationStateReducer from "./notificationStateReducer";

//#region Region for OneLogin
import profileReducer from "./profileReducer";
import tokenReducer from "./tokenReducer";
//#endregion

//#region Region for Team Members
import positionReducer from "./positionReducer";
import tmTidsInfoReducer from "./tmTidsInfoReducer";
import tmInfoReducer from "./tmInfoReducer";
import tmProficiencyReducer from "./tmProficiencyReducer";
import tmTechInfoReducer from "./tmTechInfoReducer";
import teamAssocReducer from "./teamAssocReducer";
import proficienciesReducer from "./proficienciesReducer";
import skillsReducer from "./skillsReducer";
import skillsCrudReducer from "./skillsCrudReducer";
import jobRolesCurrentTeamReducer from "./jobRolesCurrentTeamReducer";
import tmSkillsGapReducer from "./tmSkillsGapReducer";
import teamSnapshotReducer from "./teamSnapshotReducer";
//#endregion

//#region Region for Team Leads
import teamInfoReducer from "./teamInfoReducer";
import tlTeamMemberCountReducer from "./tlTeamMemberCountReducer";
import teamSkillsGapReducer from "./teamSkillsGapReducer";
import proficiencyApprovalRequestsReducer from "./proficiencyApprovalRequestsReducer";
//#endregion

//#region Region for Managers
import teamNamesReducer from "./teamNamesReducer";
import teamLeadNamesReducer from "./teamLeadNamesReducer";
import resourceCountPerSkillReducer from "./resourceCountPerSkillReducer";
import proficiencyCountPerSkillReducer from "./proficiencyCountPerSkillReducer";
import pivotGeneratorDataReducer from "./pivotGeneratorDataReducer";
import hrTaInfoReducer from "./hrTaInfoReducer";
import skillCategoriesReducer from "./skillCategoriesReducer";
import skillCategoriesCrudReducer from "./skillCategoriesCrudReducer";
import childSkillsReducer from "./childSkillsReducer";
import teamsReducer from "./teamsReducer";
import teamMembersReducer from "./teamMembersReducer";
import adminSkillsGapReducer from "./adminSkillsGapReducer";
import teamSnapshotCrudReducer from "./teamSnapshotCrudReducer";
import teamJobRoleManagerReducer from "./teamJobRoleManagerReducer";
import teamJobRoleSkillProficiencyReducer from "./teamJobRoleSkillProficiencyReducer";
import skillProficiencyCrudReducer from "./skillProficiencyCrudReducer";
//#endregion

//#region Snapshot
import fasReducer from "./fasReducer";
import faSnapshotReducer from "./faSnapshotReducer";
import faSnapshotCrudReducer from "./faSnapshotCrudReducer";
//#endregion Snapshot

//#region Logger
import addLoginDataReducer from "./addLoginDataReducer";
import getLoginDataReducer from "./getLoginDataReducer";
import getAllTmTechInfoReducer from "./getAllTmTechInfoReducer";

//#endregion Logger

// Combine and export all reducers
export default combineReducers({
  notificationState: notificationStateReducer,
  profile: profileReducer,
  token: tokenReducer,
  position: positionReducer,
  tmTidsInfo: tmTidsInfoReducer,
  tmInfo: tmInfoReducer,
  tmProficiency: tmProficiencyReducer,
  tmTechInfo: tmTechInfoReducer,
  teamAssoc: teamAssocReducer,
  proficiencies: proficienciesReducer,
  proficiencyApprovalRequests: proficiencyApprovalRequestsReducer,
  skills: skillsReducer,
  skillsCrud: skillsCrudReducer,
  jobRolesCurrentTeam: jobRolesCurrentTeamReducer,
  tmSkillsGap: tmSkillsGapReducer,
  teamSnapshot: teamSnapshotReducer,
  teamInfo: teamInfoReducer,
  tlTeamMemberCount: tlTeamMemberCountReducer,
  teamSkillsGap: teamSkillsGapReducer,
  teamNames: teamNamesReducer,
  teamLeadNames: teamLeadNamesReducer,
  resourceCountPerSkill: resourceCountPerSkillReducer,
  proficiencyCountPerSkill: proficiencyCountPerSkillReducer,
  pivotGeneratorData: pivotGeneratorDataReducer,
  hrTaInfo: hrTaInfoReducer,
  skillCategories: skillCategoriesReducer,
  skillCategoriesCrud: skillCategoriesCrudReducer,
  childSkills: childSkillsReducer,
  teams: teamsReducer,
  teamMembers: teamMembersReducer,
  adminSkillsGap: adminSkillsGapReducer,
  teamSnapshotCrud: teamSnapshotCrudReducer,
  teamJobRoleManager: teamJobRoleManagerReducer,
  teamJobRoleSkillProficiency: teamJobRoleSkillProficiencyReducer,
  skillProficiency: skillProficiencyCrudReducer,
  addLoginData: addLoginDataReducer,
  getLoginData: getLoginDataReducer,
  fas: fasReducer,
  faSnapshot: faSnapshotReducer,
  faSnapshotCrud: faSnapshotCrudReducer,
  getAllTmTechInfo: getAllTmTechInfoReducer,
});
