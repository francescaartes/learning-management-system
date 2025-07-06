import React, { useEffect, useState } from "react";
import api from "../api/api";

function EnrolledStudentsCard({ courseId }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get(`enrollments/?course=${courseId}`);
      setEnrollments(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Fetch enrollments error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [courseId]);

  return (
    <div className="card p-3 mt-3 shadow-sm">
      <h5 className="mb-3">Students</h5>
      <ul className="list-group list-group-flush">
        {loading ? (
          <li className="list-group-item text-muted">Loading...</li>
        ) : enrollments.length === 0 ? (
          <li className="list-group-item text-muted">
            No students enrolled yet.
          </li>
        ) : (
          enrollments.map((enrollment) => (
            <li
              key={enrollment.id}
              className="list-group-item d-flex align-items-center"
            >
              <img
                style={{
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  maxWidth: "2rem",
                  borderRadius: "50%",
                }}
                className="border me-2"
                src={enrollment.profile_img}
                alt={enrollment.student_name}
              />
              {enrollment.student_name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default EnrolledStudentsCard;
