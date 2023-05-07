import { GET_LOGIN_DATA } from "../actions/types";

const getLoginDataReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_LOGIN_DATA:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
};

export default getLoginDataReducer;
