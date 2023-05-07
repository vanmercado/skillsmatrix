import { GET_TM_TECH_INFO } from "../actions/types";

const tmTechInfoReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TM_TECH_INFO:
      if (payload.length === 0) return false;
      return payload;
    default:
      return state;
  }
}

export default tmTechInfoReducer;
