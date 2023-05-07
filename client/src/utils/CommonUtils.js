// Return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem("token") || null;
};

// For OneLogin SSO
// Return the profile data from the session storage
export const getProfile = () => {
  const profileStr = sessionStorage.getItem("profile");
  if (profileStr) return JSON.parse(profileStr);
  else return null;
};

// Set the profile from the session storage
export const setProfileSession = (profile) => {
  sessionStorage.setItem("profile", JSON.stringify(profile));
};

// Remove the profile from the session storage
export const removeProfileSession = () => {
  sessionStorage.removeItem("profile");
  localStorage.clear();
  // Go to the logout API of OneLogin
  window.location.href = "https://telusinternational.onelogin.com/oidc/2/logout";
  setTimeout(() => {
    window.location.href = window.location.protocol + "//" + window.location.host + "/";
  }, 1000);
};

export const convertDate = (date) => {

  const convertedDate = new Date(date);
  const year = convertedDate.getFullYear();
  var month = convertedDate.getMonth() + 1;
  var day = convertedDate.getDate();

  if (day < 10) {
    day = "0" + day;
  }

  if (month < 10) {
    month = "0" + month;
  }

  return year + "-" + month + "-" + day;

}
