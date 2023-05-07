import { GET_TEAM_SNAPSHOT } from "../actions/types";

const teamSnapshotReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TEAM_SNAPSHOT:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default teamSnapshotReducer;
