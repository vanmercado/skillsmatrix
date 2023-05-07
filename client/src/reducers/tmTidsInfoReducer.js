import { GET_TM_TIDS_INFO } from "../actions/types";

const tmTidsInfoReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TM_TIDS_INFO:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default tmTidsInfoReducer;
