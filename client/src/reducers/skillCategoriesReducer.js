import { GET_SKILL_CATEGORIES } from "../actions/types";

const skillCategoriesReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_SKILL_CATEGORIES:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default skillCategoriesReducer;
