import { GET_PROFICIENCY_COUNT_PER_SKILL } from "../actions/types";

const proficiencyPerSkillReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_PROFICIENCY_COUNT_PER_SKILL:
      if (payload.length === 0) return false;
      return payload;
    default:
      return state;
  }
}

export default proficiencyPerSkillReducer;
