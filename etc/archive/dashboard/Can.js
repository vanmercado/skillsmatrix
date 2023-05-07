import rbacRules from "./rbacRules";

// WHERE SHOULD WE PUT THE RBAC-RULES
// ALSO CAN (fine-grained?) VS SWITCH CASE and PRIVATE ROUTE (component-based) SOLUTION
// combine solution, add Can to individual components?

const check = (rbacRules, role, action, data) => {

  const permissions = rbacRules[role];

  if (!permissions) {
    // Role is not present in the rbacRules
    return false;
  }

  const staticPermissions = permissions.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // Static rule not provided for action
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      // Dynamic rule not provided for action
      return false;
    }
    return permissionCondition(data);
  }

  return false;

};

const Can = (props) =>
  check(rbacRules, props.role, props.perform, props.data)
    ? props.yes()
    : props.no();

Can.defaultProps = {
  yes: () => null,
  no: () => null,
};

export default Can;
