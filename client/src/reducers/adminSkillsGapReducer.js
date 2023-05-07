import { GET_ADMIN_SKILLS_GAP } from "../actions/types";

const adminSkillsGapReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_ADMIN_SKILLS_GAP:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default adminSkillsGapReducer;
