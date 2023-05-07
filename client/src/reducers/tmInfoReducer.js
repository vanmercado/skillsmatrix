import { GET_TM_INFO } from "../actions/types";

const tmInfoReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TM_INFO:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default tmInfoReducer;
