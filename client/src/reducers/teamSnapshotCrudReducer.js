import { UPDATE_TEAM_SNAPSHOT } from "../actions/types";

import { showSuccessMessageBox } from "../utils/CustomSweetAlerts";

const teamSnapshotCrudReducer = (state = [], { type, payload }) => {
  switch (type) {
    case UPDATE_TEAM_SNAPSHOT:
      if (!payload.isSuccess) {
        alert(payload.message);
        return false;
      }
      showSuccessMessageBox("Success", "Team Snapshot updated!");
      return payload;
    default:
      return state;
  }
}

export default teamSnapshotCrudReducer;
