import { GET_TEAM_JOBROLE_SKILL_PROFICIENCY } from "../actions/types";

const teamJobRoleSkillProficiencyReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_TEAM_JOBROLE_SKILL_PROFICIENCY:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
};

export default teamJobRoleSkillProficiencyReducer;
