import { RECEIVE_PROFILE_DATA, CLEAR_ALL } from "../actions/types";
import { setProfileSession } from "../utils/CommonUtils";

const profileReducer = (state = null, { type, payload }) => {
  switch (type) {
    case RECEIVE_PROFILE_DATA:
      if (payload.length === 0) return false;
      setProfileSession(payload.profile);
      return payload.profile;
    case CLEAR_ALL:
      return null;
    default:
      return state;
  }
};

export default profileReducer;
