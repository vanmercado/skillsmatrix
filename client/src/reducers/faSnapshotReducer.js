import { GET_FA_SNAPSHOT } from "../actions/types";

const faSnapshotReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_FA_SNAPSHOT:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
};

export default faSnapshotReducer;
