import {
  GET_SKILLS_GAP_CURRENT_ROLE,
  GET_SKILLS_GAP_SELECTED_ROLE
} from "../actions/types";

const tmSkillsGapReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_SKILLS_GAP_CURRENT_ROLE:
      if (!payload.isSuccess) return false;
      return payload.data;
    case GET_SKILLS_GAP_SELECTED_ROLE:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default tmSkillsGapReducer;
