import React from "react";
import { useUser } from "../contexts/UserContext";

function Dashboard() {
  const { user } = useUser();

  return (
    <div className="container my-5">
      <h2 className="mb-4">Welcome to Your Dashboard, {user.first_name}</h2>
    </div>
  );
}

export default Dashboard;
