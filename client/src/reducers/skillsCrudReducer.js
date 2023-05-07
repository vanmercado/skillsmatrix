import {
  CREATE_SKILL,
  DELETE_SKILL
} from "../actions/types";

import { showSuccessMessageBox } from "../utils/CustomSweetAlerts";

const skillsCrudReducer = (state = [], { type, payload }) => {
  switch (type) {
    case CREATE_SKILL:
      if (!payload.isSuccess) { alert(payload.message); return false; }
      showSuccessMessageBox("Success", "New skill created!");
      return payload;
    case DELETE_SKILL:
      if (!payload.isSuccess) { alert(payload.message); return false; }
      showSuccessMessageBox("Success", "Skill deleted!");
      return payload;
    default:
      return state;
  }
}

export default skillsCrudReducer;
