import { RECEIVE_PROFILE_DATA } from "./types";

export const receiveProfileData = profile => ({
  type: RECEIVE_PROFILE_DATA,
  payload: { profile }
});
