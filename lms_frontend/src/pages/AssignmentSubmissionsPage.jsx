import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Modal from "../components/Modal";

function AssignmentSubmissionsPage() {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState(null);
  const [scoreModal, setScoreModal] = useState({
    show: false,
    submission: null,
    score: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "submitted_on",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get(
          `submissions/instructor/?assignment=${assignmentId}`
        );
        setSubmissions(res.data.results);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  const sortedSubmissions = React.useMemo(() => {
    let sortable = [...submissions];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === "submitted_on") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else {
          aValue = aValue || "";
          bValue = bValue || "";
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [submissions, sortConfig]);

  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleOpenScoreModal = (submission) => {
    setScoreModal({ show: true, submission, score: submission.score || "" });
  };

  const handleScoreChange = (e) => {
    setScoreModal((prev) => ({ ...prev, score: e.target.value }));
  };

  const handleSaveScore = async () => {
    const { submission, score } = scoreModal;
    if (!score) return;
    try {
      await api.patch(`submissions/${submission.id}/score/`, { score });

      const res = await api.get(
        `submissions/instructor/?assignment=${assignmentId}`
      );
      setSubmissions(res.data.results);
      setScoreModal({ show: false, submission: null, score: "" });
    } catch (err) {
      console.error("Error saving score:", err);
    }
  };

  if (loading) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <h4 className="mb-4">
        {submissions[0]?.assignment_title || "Assignment Submissions"}
      </h4>
      {submissions.length === 0 ? (
        <div className="alert alert-info">No submissions yet.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th
                    role="button"
                    onClick={() => requestSort("student_full_name")}
                  >
                    Student Name{" "}
                    {sortConfig.key === "student_full_name" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    role="button"
                    onClick={() => requestSort("student_username")}
                  >
                    Username{" "}
                    {sortConfig.key === "student_username" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </th>
                  <th role="button" onClick={() => requestSort("submitted_on")}>
                    Submitted On{" "}
                    {sortConfig.key === "submitted_on" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.student_full_name}</td>
                    <td>@{s.student_username}</td>
                    <td>
                      {new Date(s.submitted_on).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{s.score ?? "-"}</td>
                    <td className="d-flex flex-wrap gap-2">
                      {s.link && (
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Open Link
                        </a>
                      )}
                      {s.file && (
                        <a
                          href={s.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Download File
                        </a>
                      )}
                      {s.text && (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setSelectedText(s.text)}
                        >
                          View Text
                        </button>
                      )}
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleOpenScoreModal(s)}
                      >
                        Score
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation">
            <ul className="pagination">
              {Array.from({
                length: Math.ceil(submissions.length / pageSize),
              }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {/* Text Modal */}
      <Modal
        show={!!selectedText}
        onClose={() => setSelectedText(null)}
        title="Submitted Text"
        body={
          <div
            style={{
              whiteSpace: "pre-wrap",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
            dangerouslySetInnerHTML={{ __html: selectedText }}
          />
        }
        size="xl"
      />

      {/* Score Modal */}
      <Modal
        show={scoreModal.show}
        onClose={() =>
          setScoreModal({ show: false, submission: null, score: "" })
        }
        title="Give Score"
        body={
          <div>
            <label className="form-label">Score</label>
            <input
              type="number"
              min="0"
              max="100"
              className="form-control"
              value={scoreModal.score}
              onChange={handleScoreChange}
            />
          </div>
        }
        confirmText="Save"
        onConfirm={handleSaveScore}
      />
    </div>
  );
}

export default AssignmentSubmissionsPage;
