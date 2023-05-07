import { GET_FAS } from "../actions/types";

const fasReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_FAS:
      if (payload.length === 0) return false;
      return payload.data;
    default:
      return state;
  }
};

export default fasReducer;
