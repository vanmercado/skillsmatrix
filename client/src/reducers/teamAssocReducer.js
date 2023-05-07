import { GET_TM_TEAM_ASSOC } from "../actions/types";

const teamAssocReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TM_TEAM_ASSOC:
      if (payload.length === 0) return false;
      return payload;
    default:
      return state;
  }
}

export default teamAssocReducer;
