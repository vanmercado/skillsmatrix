import { GET_PROFICIENCY_APPROVAL_REQUESTS } from "../actions/types";

const proficiencyApprovalRequestsReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_PROFICIENCY_APPROVAL_REQUESTS:
      return payload.length === 0 ? false : payload;
    default:
      return state;
  }
}

export default proficiencyApprovalRequestsReducer;