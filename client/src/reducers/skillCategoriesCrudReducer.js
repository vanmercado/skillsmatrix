import {
  CREATE_SKILL_CATEGORY,
  UPDATE_SKILL_CATEGORY,
  DELETE_SKILL_CATEGORY
} from "../actions/types";

import { showSuccessMessageBox } from "../utils/CustomSweetAlerts";

const skillCategoriesCrudReducer = (state = null, { type, payload }) => {
  switch (type) {
    case CREATE_SKILL_CATEGORY:
      if (!payload.isSuccess) { alert(payload.message); return false; }
      showSuccessMessageBox("Success", "New skill category created!");
      return payload;
    case UPDATE_SKILL_CATEGORY:
      if (!payload.isSuccess) { alert(payload.message); return false; }
      showSuccessMessageBox("Success", "Skill category updated!");
      return payload;
    case DELETE_SKILL_CATEGORY:
      if (!payload.isSuccess) { alert(payload.message); return false; }
      showSuccessMessageBox("Success", "Skill category deleted!");
      return payload;
    default:
      return state;
  }
}

export default skillCategoriesCrudReducer;
