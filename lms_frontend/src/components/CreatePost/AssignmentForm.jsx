import React from "react";
import TiptapEditor from "../TipTapEditor";

function AssignmentForm({ data, setData }) {
  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <label className="form-label">Instructions</label>
        <TiptapEditor
          content={data.instructions}
          onChange={(content) => setData({ ...data, instructions: content })}
          placeholder="Write the instructions students should follow..."
        />
      </div>

      <div>
        <label className="form-label">Due Date and Time</label>
        <input
          type="datetime-local"
          className="form-control"
          value={data.due_date}
          onChange={(e) => setData({ ...data, due_date: e.target.value })}
        />
      </div>

      <div>
        <label className="form-label">Score</label>
        <input
          type="number"
          className="form-control"
          placeholder="e.g., 100"
          value={data.max_score}
          onChange={(e) =>
            setData({ ...data, max_score: parseInt(e.target.value) || 0 })
          }
          min="0"
        />
      </div>

      <div>
        <label className="form-label">Submission Type</label>
        <select
          className="form-select"
          value={data.submission_type}
          onChange={(e) =>
            setData({ ...data, submission_type: e.target.value })
          }
        >
          <option value="">Select Submission Type</option>
          <option value="file">File Upload</option>
          <option value="text">Text Entry</option>
          <option value="link">Link Submission</option>
        </select>
      </div>
    </div>
  );
}

export default AssignmentForm;
