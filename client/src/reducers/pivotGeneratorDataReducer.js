import { GET_PIVOT_GENERATOR_DATA } from "../actions/types";

const pivotGeneratorDataReducer = (state = null, { type, payload }) => {
  switch (type) {
    case GET_PIVOT_GENERATOR_DATA:
      if (payload.length === 0) return false;
      return payload;
    default:
      return state;
  }
}

export default pivotGeneratorDataReducer;
