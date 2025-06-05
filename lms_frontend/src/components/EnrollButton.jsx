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
      const response = await api.post("enrollments/", {
        course_id: courseDetails.id,
        student: user.id,
      });
      setStatus(true);
      console.log(
        "Successfully enrolled in the course:",
        response.data.results
      );
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      }
      console.log("Enroll failed:", err);
      setStatus(false);
    }
  };

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const res = await api.get("enrollments/");

        const isEnrolled = res.data.some(
          (enroll) =>
            enroll.course.id === courseDetails.id && enroll.student === user.id
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

  return (
    <>
      {user?.id === courseDetails.instructor || status ? (
        <button
          className="btn btn-primary w-100"
          onClick={() => navigate(`/course/${courseDetails.id}`)}
        >
          Go to Course
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
