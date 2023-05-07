import { stringify } from "query-string";

// Static OIDC params for a single provider
const authority = "https://telusinternational.onelogin.com/oidc/2";
const client_id = "b6738de0-b3d7-0138-44d8-0ab92fbd89cc167174";
const redirect_uri =
  window.location.protocol + "//" + window.location.host + "/auth";

const response_type = "id_token token";
const scope = "openid profile";

export const beginAuth = ({ state, nonce }) => {
  // Generate authentication URL
  const params = stringify({
    client_id,
    redirect_uri,
    response_type,
    scope,
    state,
    nonce,
  });

  const authUrl = `${authority}/auth?${params}`;

  // Attempt login by navigating to authUrl
  window.location.assign(authUrl);
};
