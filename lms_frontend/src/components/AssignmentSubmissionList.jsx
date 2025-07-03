import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function AssignmentSubmissionsList({ assignmentId }) {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get(
          `submissions/instructor/?assignment=${assignmentId}`
        );
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  if (loading) {
    return <div className="card-body">Loading submissions...</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="card-body">
        <small className="text-muted">No submissions yet.</small>
      </div>
    );
  }

  const displayed = showAll ? submissions : submissions.slice(0, 3);

  return (
    <div className="card-body">
      <h6 className="fw-bold mb-3">Submissions ({submissions.length})</h6>
      <div className="list-group">
        {displayed.map((s) => (
          <div
            key={s.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <div className="fw-semibold">
              {s.student_full_name || "Unnamed Student"}
            </div>
            <small className="text-muted text-end">
              {new Date(s.submitted_on).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))}
      </div>
      <button
        className="btn btn-outline-primary w-100 mt-3"
        onClick={() => navigate(`/assignments/${assignmentId}/submissions`)}
      >
        View All Submissions
      </button>
    </div>
  );
}

export default AssignmentSubmissionsList;
