import { GET_HR_TA_INFO } from "../actions/types";

const hrTaInfoReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_HR_TA_INFO:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default hrTaInfoReducer;
