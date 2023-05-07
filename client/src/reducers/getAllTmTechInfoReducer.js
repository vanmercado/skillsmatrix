import { GET_ALL_TM_TECH_INFO } from "../actions/types";

const getAllTmTechInfoReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_ALL_TM_TECH_INFO:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
};

export default getAllTmTechInfoReducer;
