import { GET_TEAM_LEAD_NAMES } from "../actions/types";

const teamLeadNamesReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TEAM_LEAD_NAMES:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default teamLeadNamesReducer;
