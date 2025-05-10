import { useEffect, useState } from "react";
import api from "../api/api";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function EnrollButton({ courseDetails }) {
  const [status, setStatus] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const handleEnroll = async () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.post(
        "enrollments/",
        { course: courseDetails.id, student: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus(true);
      console.log(
        "Successfully enrolled in the course:",
        response.data.results
      );
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
      }
      console.log("Enroll failed:", err);
      setStatus(false);
    }
  };

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const res = await api.get("enrollments/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const isEnrolled = res.data.results.some(
          (enroll) =>
            enroll.course === courseDetails.id && enroll.student === user.id
        );
        setStatus(isEnrolled);
      } catch (err) {
        console.log("Enrollment check failed:", err);
      }
    };

    if (user && token) {
      checkEnrollment();
    }
  }, [user, courseDetails, token]);

  if (user?.id === courseDetails.instructor) {
    return <></>;
  }

  return (
    <>
      {status ? (
        <button className="btn btn-primary w-100" disabled>
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
