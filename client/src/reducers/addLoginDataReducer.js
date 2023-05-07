import { ADD_LOGIN_DATA } from "../actions/types";

const addLoginDataReducer = (state = null, { type, payload }) => {
  switch (type) {
    case ADD_LOGIN_DATA:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
};

export default addLoginDataReducer;
