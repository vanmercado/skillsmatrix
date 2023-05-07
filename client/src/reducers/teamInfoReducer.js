import { GET_TL_TEAM_INFO } from "../actions/types";

const teamInfoReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TL_TEAM_INFO:
      if (payload.length === 0) return false;
      return payload;
    default:
      return state;
  }
}

export default teamInfoReducer;
