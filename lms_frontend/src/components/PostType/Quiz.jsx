import React from "react";
import { Link } from "react-router-dom";

function Quiz({ post, isInstructor = false, showGoToQuizButton = false }) {
  let dueDate = "None";
  const timeLimit = post.quiz.time_limit || 60;
  const now = new Date();

  if (post.quiz.due_date) {
    dueDate = new Date(post.quiz.due_date);
  }

  return (
    <div className="mt-2">
      <h5>{post.title}</h5>
      <div className="d-flex flex-wrap gap-3 mb-2">
        <div>
          <strong>Due:</strong> {dueDate.toLocaleString()}
        </div>
        <div>
          <strong>Time limit:</strong> {timeLimit} min
        </div>
      </div>

      <div
        className="resource-content mt-2"
        dangerouslySetInnerHTML={{
          __html: post.quiz.instructions,
        }}
      />

      {now >= dueDate && (
        <div className="alert alert-warning mt-2">
          The deadline has passed. You can no longer take this quiz.
        </div>
      )}

      {now < dueDate && showGoToQuizButton && !isInstructor && (
        <Link to={`/quiz/${post.quiz.id}/`}>
          <button className="btn btn-outline-primary mt-2 w-100">
            Go to Quiz
          </button>
        </Link>
      )}

      {isInstructor && (
        <Link to={`/quiz/${post.quiz.id}/`}>
          <button className="btn btn-outline-primary w-100">View Quiz</button>
        </Link>
      )}
    </div>
  );
}

export default Quiz;
