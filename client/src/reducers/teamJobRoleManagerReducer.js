import { GET_TEAM_JOBROLE_MANAGER } from "../actions/types";

const teamJobRoleManagerReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TEAM_JOBROLE_MANAGER:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
};

export default teamJobRoleManagerReducer;
