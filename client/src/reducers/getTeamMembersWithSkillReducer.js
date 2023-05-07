import { GET_TEAM_MEMBERS_WITH_SKILL } from "../actions/types";

const getTeamMembersWithSkillReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_TEAM_MEMBERS_WITH_SKILL:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
};

export default getTeamMembersWithSkillReducer;
