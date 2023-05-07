import { GET_RESOURCE_COUNT_PER_SKILL } from "../actions/types";

const resourceCountPerSkillReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_RESOURCE_COUNT_PER_SKILL:
      if (payload.length === 0) return false;
      return payload;
    default:
      return state;
  }
}

export default resourceCountPerSkillReducer;
