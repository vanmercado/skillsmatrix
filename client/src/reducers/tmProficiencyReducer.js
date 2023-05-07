import {
  CREATE_TM_PROFICIENCY,
  UPDATE_TM_PROFICIENCY,
  DELETE_TM_PROFICIENCY
} from "../actions/types";

import { showSuccessMessageBox } from "../utils/CustomSweetAlerts";

const tmProficiencyReducer = (state = null, { type, payload }) => {
  switch (type) {
    case CREATE_TM_PROFICIENCY:
      if (!payload.isSuccess) { alert(payload.message); return false; }
      showSuccessMessageBox("Success", "New skill proficiency created!");
      return payload;
    case UPDATE_TM_PROFICIENCY:
      if (!payload.isSuccess) { alert(payload.message); return false; }
      showSuccessMessageBox("Success", "Skill proficiency updated!");
      return payload;
    case DELETE_TM_PROFICIENCY:
      if (!payload.isSuccess) { alert(payload.message); return false; }
      showSuccessMessageBox("Success", "Skill proficiency deleted!");
      return payload;
    default:
      return state;
  }
}

export default tmProficiencyReducer;
