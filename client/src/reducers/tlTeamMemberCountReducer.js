import { GET_TL_TEAM_MEMBER_COUNT } from "../actions/types";

const tlTeamMemberCountReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TL_TEAM_MEMBER_COUNT:
      if (payload.length === 0) return false;
      return payload[0].team_member_count;
    default:
      return state;
  }
}

export default tlTeamMemberCountReducer;
