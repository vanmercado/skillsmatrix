import { GET_TEAM_MEMBERS } from "../actions/types";

const teamMembersReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_TEAM_MEMBERS:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default teamMembersReducer;
