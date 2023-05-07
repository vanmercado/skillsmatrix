import {
  GET_JOB_ROLES_CURRENT_TEAM
} from "../actions/types";

const jobRolesCurrentTeamReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_JOB_ROLES_CURRENT_TEAM:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default jobRolesCurrentTeamReducer;
