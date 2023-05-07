import { GET_TM_POSITION } from "../actions/types";

const positionReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_TM_POSITION:
      if (!payload) return false;
      return payload;
    default:
      return state;
  }
}

export default positionReducer;
