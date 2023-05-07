function TeamSkillsGapAnaylsis() {
  return <h1>Team Skills Gap Analysis</h1>;
}

export default TeamSkillsGapAnaylsis;

// //#region Import components
// // React components
// import React, { useEffect, useState } from "react";
// import { connect } from "react-redux";

// // Material UI components
// import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
// import MUIDataTable from "mui-datatables";

// // Common utils and actions
// import { getTlTeamSkillsGap } from "../../actions";
// import axios from "axios";
// import _ from "lodash";
// //#endregion

// // Theme for Material UI Data Table
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

// const getPercentageGap = (personal_rating, proficiency_id) => {
//   if (personal_rating === proficiency_id) return 0;
//   else if (personal_rating === null || personal_rating === 0) return 100;
//   return personal_rating < proficiency_id
//     ? 100 - (personal_rating / proficiency_id) * 100
//     : 100 - (proficiency_id / personal_rating) * 100;
// };

// const getSummarizedSkillsGap = (teamSkillsGap) => {
//   return teamSkillsGap.reduce((result, memberInfo) => {
//     const { job_profile_id, tm_id, team_id } = memberInfo;
//     const teamAndJobRoleId = `${team_id}-${job_profile_id}`;
//     if (_.isEmpty(result[teamAndJobRoleId])) {
//       result[teamAndJobRoleId] = {};
//     }
//     if (_.isEmpty(result[teamAndJobRoleId][tm_id])) {
//       result[teamAndJobRoleId][tm_id] = {};
//       result[teamAndJobRoleId][tm_id].tm_name = memberInfo.tm_name;
//     }
//     const { personal_rating, proficiency_id } = memberInfo;
//     const percentageGap = getPercentageGap(
//       personal_rating,
//       proficiency_id
//     ).toFixed(2);
//     result[teamAndJobRoleId][tm_id][memberInfo.skill_id] = `${percentageGap}%`;
//     return result;
//   }, {});
// };

// const generateColumns = (idealProficiencies, skills) => {
//   return idealProficiencies.reduce((result, idealProf) => {
//     const { team_id, job_profile_id, skill_id } = idealProf;
//     const teamAndJobRoleId = `${team_id}-${job_profile_id}`;
//     if (_.isEmpty(result[teamAndJobRoleId])) {
//       result[teamAndJobRoleId] = [];
//       result[teamAndJobRoleId].push({
//         name: "tm_name",
//         label: "Member Name",
//         options: {
//           filter: true,
//           sort: true,
//         },
//       });
//     }
//     const { skill_desc } = skills[skill_id];
//     result[teamAndJobRoleId].push({
//       name: `${skill_id}`,
//       label: skill_desc,
//       options: {
//         filter: true,
//         sort: true,
//       },
//     });
//     return result;
//   }, {});
// };

// const getSkillIdsAndJobRoleIds = (teamSkillsGap) => {
//   return teamSkillsGap.reduce(
//     (result, memberInfo) => {
//       if (!result.skillIds.has(memberInfo.skill_id)) {
//         result.skillIds.add(memberInfo.skill_id);
//       }
//       if (!result.jobRoleIds.has(memberInfo.job_profile_id)) {
//         result.jobRoleIds.add(memberInfo.job_profile_id);
//       }
//       return result;
//     },
//     { skillIds: new Set(), jobRoleIds: new Set() }
//   );
// };

// const options = {
//   responsive: "standard",
//   selectableRows: "none",
//   sortFilterList: true,
// };

// const TeamSkillsGapAnalysis = (props) => {
//   const { profile, getTlTeamSkillsGap, teamSkillsGap } = props;
//   const [skillsGapPerJobRole, setSkillsGapPerJobRole] = useState({});
//   const [columnsPerJobRole, setColumnsPerJobRole] = useState({});
//   const [skills, setSkills] = useState({});
//   const [jobRoles, setJobRoles] = useState({});
//   const [tables, setTables] = useState([]);

//   useEffect(() => {
//     if (profile) getTlTeamSkillsGap({ email: profile.email });
//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     if (!_.isEmpty(teamSkillsGap)) {
//       setSkillsGapPerJobRole(getSummarizedSkillsGap(teamSkillsGap));
//       const { skillIds, jobRoleIds } = getSkillIdsAndJobRoleIds(teamSkillsGap);
//       axios
//         .post("/api/tm/skills", { skillIds: Array.from(skillIds) })
//         .then((res) =>
//           setSkills(
//             res.data.reduce((result, skill) => {
//               result[skill.skill_id] = skill;
//               return result;
//             }, {})
//           )
//         )
//         .catch((err) => {
//           throw err;
//         });
//       axios
//         .post("/api/tm/jobRoles", { jobRoleIds: Array.from(jobRoleIds) })
//         .then((res) =>
//           setJobRoles(
//             res.data.reduce((result, jobRole) => {
//               result[jobRole.job_profile_id] = jobRole;
//               return result;
//             }, {})
//           )
//         )
//         .catch((err) => {
//           throw err;
//         });
//     }
//     // eslint-disable-next-line
//   }, [teamSkillsGap]);

//   //build columns for table
//   useEffect(() => {
//     if (_.isEmpty(skills)) {
//       return;
//     }
//     axios
//       .post("/api/tl/teamJobRoleIdealProficiencies", { email: profile.email })
//       .then((res) => setColumnsPerJobRole(generateColumns(res.data, skills)))
//       .catch((err) => {
//         throw err;
//       });
//     // eslint-disable-next-line
//   }, [skills]);

//   useEffect(() => {
//     if (
//       _.isEmpty(jobRoles) ||
//       _.isEmpty(skillsGapPerJobRole) ||
//       _.isEmpty(columnsPerJobRole)
//     ) {
//       return;
//     }
//     setTables(
//       Object.keys(skillsGapPerJobRole).reduce((result, teamAndJobRoleId) => {
//         const [teamId, jobRoleId] = teamAndJobRoleId.split("-");
//         const jobRole = jobRoles[jobRoleId];
//         result.push(
//           <div>
//             <MUIDataTable
//               key={teamAndJobRoleId}
//               title={`Team ${teamId} - ${jobRole.job_profile_name}`}
//               data={
//                 skillsGapPerJobRole[teamAndJobRoleId]
//                   ? Object.values(skillsGapPerJobRole[teamAndJobRoleId])
//                   : []
//               }
//               columns={columnsPerJobRole[teamAndJobRoleId]}
//               options={options}
//             />
//             <br />
//           </div>
//         );
//         return result;
//       }, [])
//     );
//   }, [jobRoles, skillsGapPerJobRole, columnsPerJobRole]);

//   return <MuiThemeProvider theme={getMuiTheme()}>{tables}</MuiThemeProvider>;
// };

// const mapStateToProps = (state) => ({
//   teamSkillsGap: state.teamSkillsGap,
// });

// export default connect(mapStateToProps, { getTlTeamSkillsGap })(
//   TeamSkillsGapAnalysis
// );
