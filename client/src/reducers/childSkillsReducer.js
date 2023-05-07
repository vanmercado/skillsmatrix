import { GET_CHILD_SKILLS } from "../actions/types";

const childSkillsReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_CHILD_SKILLS:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default childSkillsReducer;
