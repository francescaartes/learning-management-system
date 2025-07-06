import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import api from "../api/api";

function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittedScore, setSubmittedScore] = useState(null);
  const [studentAttempts, setStudentAttempts] = useState([]);
  const [instructorAttempts, setInstructorAttempts] = useState([]);
  const [startError, setStartError] = useState("");

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await api.get(`/quizzes/${quizId}/`);
        setQuiz(res.data);
        console.log("Quiz data", res.data);

        if (user?.id === res.data.author) {
          const attemptsRes = await api.get(
            `/quizzes/${quizId}/instructor_detail/`
          );
          setInstructorAttempts(attemptsRes.data.attempts);
          console.log(attemptsRes.data);
        } else {
          const attemptsRes = await api.get(`/quizzes/${quizId}/my_attempts/`);
          setStudentAttempts(attemptsRes.data.results);
        }
      } catch (err) {
        console.error(err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId, navigate, user]);

  const groupAttemptsByStudent = (attempts) => {
    const grouped = {};
    attempts.forEach((a) => {
      if (!grouped[a.student_name]) {
        grouped[a.student_name] = [];
      }
      grouped[a.student_name].push(a);
    });
    return grouped;
  };

  useEffect(() => {
    let interval;
    if (endTime) {
      interval = setInterval(() => {
        const remaining = Math.max(
          Math.floor((endTime - Date.now()) / 1000),
          0
        );
        setTimer(remaining);
        if (remaining === 0) {
          clearInterval(interval);
          submitAnswers();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [endTime]);

  const startTimer = () => {
    const attemptsCount = studentAttempts.length;
    if (quiz.max_attempts && attemptsCount >= quiz.max_attempts) {
      setStartError(
        `You have reached the maximum number of attempts (${quiz.max_attempts}).`
      );
      return;
    }
    setStartError("");
    const timeLimit = (quiz.time_limit || 60) * 60;
    setTimer(timeLimit);
    setEndTime(Date.now() + timeLimit * 1000);
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const nextQuestion = () => {
    if (activeIndex < quiz.questions.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const submitAnswers = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      setStartError("Please answer all questions before submitting.");
      return;
    }
    if (!window.confirm("Submit your answers?")) return;
    setSubmitting(true);
    setStartError("");
    try {
      const res = await api.post("/quiz-attempts/", {
        quiz: quiz.id,
        answers,
      });
      setSubmittedScore(res.data.score);
    } catch (err) {
      console.error("Quiz submission error:", err.response?.data);
      setStartError(
        err.response?.data?.detail ||
          "An error occurred while submitting your quiz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !quiz) return <div>Loading...</div>;

  const dueDate = new Date(quiz.due_date);
  const now = new Date();
  const isInstructor = user?.id === quiz.author;

  // Instructor view
  if (isInstructor) {
    return (
      <div className="container mt-4">
        <h4>{quiz.title} (Instructor Preview)</h4>
        <p>
          <strong>Due:</strong> {dueDate.toLocaleString()} |{" "}
          <strong>Time Limit:</strong> {quiz.time_limit || 60} min
        </p>
        <div
          className="mb-3"
          dangerouslySetInnerHTML={{ __html: quiz.instructions }}
        />
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="mb-3 border p-3 rounded">
            <strong>
              {idx + 1}. {q.question_text}
            </strong>
            <ul className="mt-2">
              {q.options.map((opt) => (
                <li key={opt}>
                  {opt}
                  {opt === q.correct_answer && (
                    <span className="text-success"> (Correct)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h5 className="mt-4">Student Attempts</h5>
        {instructorAttempts.length === 0 ? (
          <div className="text-muted">No attempts yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Score</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupAttemptsByStudent(instructorAttempts)).map(
                ([student, attempts]) => (
                  <React.Fragment key={student}>
                    <tr className="table-secondary">
                      <td colSpan="3">
                        <strong>{student}</strong>
                      </td>
                    </tr>
                    {attempts.map((a, idx) => (
                      <tr key={a.id}>
                        <td>Attempt {idx + 1}</td>
                        <td>
                          {a.score} / {a.total}
                        </td>
                        <td>
                          {a.submitted_on
                            ? new Date(a.submitted_on).toLocaleString()
                            : "In Progress"}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        )}
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  // Student cannot attempt if past due date
  if (now > dueDate) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <strong>
            The quiz deadline has passed. You can no longer take this quiz.
          </strong>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  // Student already submitted in this session
  if (submittedScore !== null) {
    return (
      <div className="container mt-4">
        <div className="alert alert-success">
          Quiz submitted! Your score: {submittedScore}
        </div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back to Course
        </button>
      </div>
    );
  }

  const attemptsCount = studentAttempts.length;
  const current = quiz.questions[activeIndex];

  return (
    <div className="container mt-4">
      {!endTime ? (
        <div>
          <h4>{quiz.title}</h4>
          <p>
            <strong>Time Limit:</strong> {quiz.time_limit || 60} min
          </p>
          <p>
            <strong>Attempts Used:</strong> {attemptsCount} /{" "}
            {quiz.max_attempts}
          </p>
          <div
            className="mb-3"
            dangerouslySetInnerHTML={{ __html: quiz.instructions }}
          />
          {studentAttempts.length > 0 && (
            <div className="mt-3">
              <h5>Your Previous Attempts</h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Score</th>
                    <th>Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAttempts.map((a, idx) => (
                    <tr key={a.id}>
                      <td>{idx + 1}</td>
                      <td>
                        {a.score} / {a.total}
                      </td>
                      <td>
                        {a.submitted_on
                          ? new Date(a.submitted_on).toLocaleString()
                          : "In Progress"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {startError && (
            <div className="alert alert-danger mt-3">{startError}</div>
          )}
          <button className="btn btn-primary mt-2" onClick={startTimer}>
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <strong>Time Remaining:</strong> {formatDuration(timer)}
            </div>
            <div>
              Question {activeIndex + 1} of {quiz.questions.length}
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <p>
                <strong>{current.question_text}</strong>
              </p>
              {current.options.map((opt, i) => (
                <label
                  key={i}
                  className={`form-check mb-2 p-2 border rounded ${
                    answers[current.id] === opt ? "bg-light border-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    value={opt}
                    className="form-check-input me-2"
                    onChange={() => handleOptionChange(current.id, opt)}
                    checked={answers[current.id] === opt}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          {startError && <div className="alert alert-danger">{startError}</div>}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              onClick={prevQuestion}
              disabled={activeIndex === 0}
            >
              Back
            </button>
            {activeIndex < quiz.questions.length - 1 ? (
              <button
                className="btn btn-outline-primary"
                onClick={nextQuestion}
              >
                Next
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={submitAnswers}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Answers"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default QuizPage;
