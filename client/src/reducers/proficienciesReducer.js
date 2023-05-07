import { GET_PROFICIENCIES } from "../actions/types";

const proficiencies = (state = [], { type, payload }) => {
  switch (type) {
    case GET_PROFICIENCIES:
      if (!payload.isSuccess) return false;
      return payload.data;
    default:
      return state;
  }
}

export default proficiencies;
