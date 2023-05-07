import { GET_TL_TEAM_SKILLSGAP } from "../actions/types";

const teamSkillsGapReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TL_TEAM_SKILLSGAP:
      return payload.length === 0 ? false : payload;
    default:
      return state;
  }
}

export default teamSkillsGapReducer;
