import React from "react";

function Assignment({ post }) {
  const assignment = post.assignment;
  let dueDate = "None";

  if (assignment.due_date) {
    dueDate = new Date(assignment.due_date);
  }

  return (
    <div className="d-flex flex-column gap-2">
      <h5 className="mt-2 mb-0">{post.title}</h5>

      <div className="d-flex flex-wrap gap-3 mb-2">
        <div>
          <strong>Due:</strong> {dueDate.toLocaleString()}
        </div>
        <div>
          <strong>Submission Type:</strong>{" "}
          {assignment.submission_type.charAt(0).toUpperCase() +
            assignment.submission_type.slice(1)}
        </div>
        <div>
          <strong>Score:</strong> {assignment.max_score}
        </div>
      </div>

      <div
        className="html-content"
        dangerouslySetInnerHTML={{
          __html: assignment.instructions,
        }}
      />

      {assignment.resources && assignment.resources.length > 0 && (
        <div className="mt-2">
          <strong>Resources:</strong>
          <ul>
            {assignment.resources.map((r) => (
              <li key={r.id}>
                <a href={r.link} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Assignment;
