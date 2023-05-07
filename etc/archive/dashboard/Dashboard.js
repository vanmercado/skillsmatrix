// React components
import React from "react";

// Child components
import HrPoc from "./HrPoc";
import Manager from "./Manager";
import Member from "./Member";

// Conditional child component based on role's value
const renderDashboard = (role) => {
  switch (role) {
    case "admin":
      return <HrPoc />;
    case "member":
      return <Member />;
    case "manager":
      return <Manager />;
    default:
      return null;
  }
}

function Dashboard() {
  return renderDashboard("member");
}

export default Dashboard;
