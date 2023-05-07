import { SET_NOFICATION_VALUE } from "../actions/types";

const notificationStateReducer = (state = false, action) => {
  switch (action.type) {
    case SET_NOFICATION_VALUE:
      return { value: action.value };
    default:
      return state;
  }
};

export default notificationStateReducer;
