import { GET_SKILLS } from "../actions/types";

const skillsReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_SKILLS:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default skillsReducer;
