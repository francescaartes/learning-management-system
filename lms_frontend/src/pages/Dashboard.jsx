import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";

function Dashboard() {
  const { user } = useUser();
  const [dashboard, setDashboard] = useState(
    localStorage.getItem("dashboard") || "Student"
  );

  const changeDashboard = () => {
    setDashboard((prev) => (prev === "Student" ? "Instructor" : "Student"));
  };

  useEffect(() => {
    localStorage.setItem("dashboard", dashboard);
  }, [dashboard]);

  return (
    <div className="container my-4">
      {user?.is_instructor ? (
        <div className="">
          <button
            onClick={() => changeDashboard()}
            className="btn bg-light mb-2 "
            style={{ minWidth: "8rem" }}
          >
            <span className="me-2">
              {dashboard == "Student" ? "Instructor" : "Student"}
            </span>
            <i className="bi bi-arrow-left-right"></i>
          </button>
          {dashboard == "Student" ? (
            <div>
              <StudentDashboard />
            </div>
          ) : (
            <div>
              <InstructorDashboard />
            </div>
          )}
        </div>
      ) : (
        <>
          <StudentDashboard />
        </>
      )}
    </div>
  );
}

export default Dashboard;
