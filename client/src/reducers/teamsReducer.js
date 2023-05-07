import { GET_TEAMS } from "../actions/types";

const teamsReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TEAMS:
      if (payload.length === 0) return false;
      return payload.data;
    default:
      return state;
  }
}

export default teamsReducer;
