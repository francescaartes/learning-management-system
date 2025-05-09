import React, { useState } from "react";
import api from "../api/api";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function EnrollButton({ course }) {
  const [status, setStatus] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
    }

    const token = localStorage.getItem("access");

    if (!token) {
      console.log("Token error!");
      navigate("/login");
      return;
    }
    try {
      const response = await api.post(
        "enrollments/",
        { course: course },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Successfully enrolled in the course:", response.data);
    } catch (err) {
      console.log("Enroll failed:", err);
      setStatus(false);
    }
  };
  return (
    <>
      {status ? (
        <button
          className="btn btn-primary w-100 disabled"
          onClick={handleEnroll}
        >
          Enrolled
        </button>
      ) : (
        <button className="btn btn-primary w-100" onClick={handleEnroll}>
          Enroll Now
        </button>
      )}
    </>
  );
}

export default EnrollButton;
