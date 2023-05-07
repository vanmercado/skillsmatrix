import {
  UPDATE_SKILL_PROFICIENCY,
  ADD_SKILL_PROFICIENCY,
  DELETE_SKILL_PROFICIENCY,
} from "../actions/types";

const skillProficiencyCrudReducer = (state = null, { type, payload }) => {
  switch (type) {
    case UPDATE_SKILL_PROFICIENCY:
      if (!payload.isSuccess) return false;
      return payload.data;
    case ADD_SKILL_PROFICIENCY:
      if (!payload.isSuccess) {
        alert(payload.data);
        return false;
      } else {
        return payload.data;
      }
    case DELETE_SKILL_PROFICIENCY:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
};

export default skillProficiencyCrudReducer;
