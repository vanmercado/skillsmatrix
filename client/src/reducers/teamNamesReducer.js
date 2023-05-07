import { GET_TEAM_NAMES } from "../actions/types";

const teamNamesReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TEAM_NAMES:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default teamNamesReducer;
