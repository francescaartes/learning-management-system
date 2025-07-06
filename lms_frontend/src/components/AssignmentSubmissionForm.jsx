import React, { useState, useEffect } from "react";
import api from "../api/api";
import TipTapEditor from "./TipTapEditor";

function AssignmentSubmissionForm({ assignmentId, submissionType, dueDate }) {
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  const due = new Date(dueDate);
  const now = new Date();
  const isPastDue = now > due;

  useEffect(() => {
    fetchSubmission();
  }, []);

  const fetchSubmission = async () => {
    setLoading(true);
    try {
      const res = await api.get(`submissions/?assignment=${assignmentId}`);
      if (res.data.results.length > 0) {
        setSubmission(res.data.results[0]);
      }
    } catch (err) {
      console.error("Fetch submission error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isPastDue) {
      alert("The deadline has passed. You can no longer submit.");
      return;
    }

    const formData = new FormData();
    formData.append("assignment", assignmentId);
    if (file) formData.append("file", file);
    if (text) formData.append("text", text);
    if (link) formData.append("link", link);

    try {
      await api.post("submissions/", formData);
      fetchSubmission();
      setFile(null);
      setText("");
      setLink("");
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  const handleUnsubmit = async () => {
    if (isPastDue) {
      alert("The deadline has passed. You can no longer unsubmit.");
      return;
    }

    if (submission) {
      await api.delete(`submissions/${submission.id}/`);
      setSubmission(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (submission) {
    return (
      <div className="card p-3 mt-4">
        <h5>Your Submission</h5>
        {submission.file && (
          <div>
            <a href={submission.file} target="_blank" rel="noreferrer">
              {submission.file.split("/").pop()}
            </a>
          </div>
        )}
        {submission.text && (
          <div
            className="resource-content"
            dangerouslySetInnerHTML={{
              __html: submission.text,
            }}
          />
        )}
        {submission.link && (
          <div>
            <a href={submission.link} target="_blank" rel="noreferrer">
              {submission.link}
            </a>
          </div>
        )}
        <div>
          <small>
            Submitted on: {new Date(submission.submitted_on).toLocaleString()}
          </small>
        </div>
        <button
          onClick={handleUnsubmit}
          className="btn btn-danger mt-2"
          disabled={isPastDue}
        >
          Unsubmit
        </button>
        {isPastDue && (
          <div className="text-danger mt-2">
            Deadline has passed. You can no longer modify your submission.
          </div>
        )}
      </div>
    );
  }

  if (isPastDue) {
    return (
      <div className="alert alert-warning mt-4">
        <strong>
          The deadline has passed. You can no longer submit this assignment.
        </strong>
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-3 mt-4 d-flex flex-column gap-2">
      <h5>Submit Your Work</h5>
      {submissionType === "file" && (
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="form-control mb-2"
        />
      )}
      {submissionType === "text" && (
        <TipTapEditor
          content={text}
          onChange={(html) => setText(html)}
          placeholder="Write your answer/s here..."
        />
      )}
      {submissionType === "link" && (
        <input
          type="url"
          placeholder="Paste the link here..."
          className="form-control mb-2"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      )}
      <button onClick={handleSubmit} className="btn btn-primary">
        Submit
      </button>
    </div>
  );
}

export default AssignmentSubmissionForm;
