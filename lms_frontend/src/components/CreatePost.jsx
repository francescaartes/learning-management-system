import { useState } from "react";
import AnnouncementForm from "./CreatePost/AnnouncementForm";
import ResourceForm from "./CreatePost/ResourceForm";
import QuizForm from "./CreatePost/QuizForm";
import AssignmentForm from "./CreatePost/AssignmentForm";
import api from "../api/api";

function CreatePost({ courseId, onPostCreated, onCancel }) {
  const [selectedType, setSelectedType] = useState("announcement");
  const [newPost, setNewPost] = useState({
    title: "",
    type: selectedType,
    course: courseId,
  });

  const postTypes = [
    { type: "Announcement", value: "announcement" },
    { type: "Resource", value: "resource" },
    { type: "Assignment", value: "assignment" },
    { type: "Quiz", value: "quiz" },
  ];

  const [announcementData, setAnnouncementData] = useState({ message: "" });
  const [resourceData, setResourceData] = useState({
    content: "",
  });
  const [assignmentData, setAssignmentData] = useState({
    instructions: "",
    due_date: "",
    max_score: null,
    submission_type: "",
  });
  const [quizData, setQuizData] = useState({
    instructions: "",
    due_date: "",
    time_limit: 60,
    max_attempts: 1,
    questions: [],
  });

  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreatePost = async () => {
    setErrorMessage(""); // clear previous error

    // General validation
    if (!newPost.title.trim()) {
      setErrorMessage("Please provide a title for your post.");
      return;
    }

    // Announcement validation
    if (selectedType === "announcement") {
      if (!announcementData.message.trim()) {
        setErrorMessage("Announcement message cannot be empty.");
        return;
      }
    }

    // Resource validation
    if (selectedType === "resource") {
      if (!resourceData.content.trim()) {
        setErrorMessage("Resource content cannot be empty.");
        return;
      }
    }

    // Assignment validation
    if (selectedType === "assignment") {
      if (!assignmentData.instructions.trim()) {
        setErrorMessage("Assignment instructions cannot be empty.");
        return;
      }
      if (!assignmentData.due_date) {
        setErrorMessage("Please set a due date for the assignment.");
        return;
      }
      if (!assignmentData.max_score) {
        setErrorMessage("Please set a maximum score for the assignment.");
        return;
      }
      if (!assignmentData.submission_type) {
        setErrorMessage("Please select a submission type.");
        return;
      }
    }

    // Quiz validation
    if (selectedType === "quiz") {
      if (!quizData.instructions.trim()) {
        setErrorMessage("Quiz instructions cannot be empty.");
        return;
      }
      if (!quizData.due_date) {
        setErrorMessage("Please set a due date for the quiz.");
        return;
      }
      if (!quizData.time_limit || quizData.time_limit < 1) {
        setErrorMessage("Time limit must be at least 1 minute.");
        return;
      }
      if (!quizData.max_attempts || quizData.max_attempts < 1) {
        setErrorMessage("Number of attempts must be at least 1.");
        return;
      }
      if (quizData.questions.length === 0) {
        setErrorMessage("Please add at least one question to the quiz.");
        return;
      }

      for (const [index, q] of quizData.questions.entries()) {
        if (!q.question_text.trim()) {
          setErrorMessage(`Question ${index + 1} is missing its text.`);
          return;
        }
        if (q.options.some((opt) => !opt.trim())) {
          setErrorMessage(`Question ${index + 1} has an empty option.`);
          return;
        }
        if (!q.correct_answer.trim()) {
          setErrorMessage(`Question ${index + 1} is missing a correct answer.`);
          return;
        }
      }
    }

    setCreating(true);

    try {
      const postData = {
        title: newPost.title,
        type: selectedType,
        course: courseId,
        ...(selectedType === "announcement" && {
          announcement: announcementData,
        }),
        ...(selectedType === "resource" && {
          resource: {
            content: resourceData.content,
          },
        }),
        ...(selectedType === "assignment" && {
          assignment: {
            instructions: assignmentData.instructions,
            due_date: assignmentData.due_date,
            max_score: Number(assignmentData.max_score),
            submission_type: assignmentData.submission_type,
          },
        }),
        ...(selectedType === "quiz" && {
          quiz: {
            instructions: quizData.instructions,
            due_date: quizData.due_date,
            time_limit: Number(quizData.time_limit),
            max_attempts: Number(quizData.max_attempts),
            questions: quizData.questions.map((q) => ({
              question_text: q.question_text,
              options: q.options,
              correct_answer: q.correct_answer,
            })),
          },
        }),
      };

      console.log("POST DATA:", JSON.stringify(postData, null, 2));
      await api.post(`posts/`, postData);

      if (onPostCreated) onPostCreated();
      if (onCancel) onCancel();

      // Reset all forms
      setNewPost({ title: "", type: "announcement", course: courseId });
      setAnnouncementData({ message: "" });
      setResourceData({ content: "" });
      setAssignmentData({
        instructions: "",
        due_date: "",
        max_score: 0,
        submission_type: "",
      });
      setQuizData({
        instructions: "",
        due_date: "",
        time_limit: 60,
        max_attempts: 1,
        questions: [],
      });
    } catch (err) {
      console.error("Post creation error", err.response?.data || err);
      setErrorMessage(
        err.response?.data?.detail ||
          "An error occurred while creating the post."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light">
        <i className="bi bi-pencil-square me-2"></i>Create Post
      </div>
      <div className="card-body d-flex flex-column gap-3">
        <div className="dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {postTypes.find((t) => t.value === selectedType)?.type}
          </button>
          <ul className="dropdown-menu">
            {postTypes.map(({ type, value }) => (
              <li key={value}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedType(value);
                    setNewPost((prev) => ({ ...prev, type: value }));
                  }}
                >
                  {type}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="d-flex flex-column gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter a short, clear title"
            name="title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />

          {selectedType === "announcement" && (
            <AnnouncementForm
              data={announcementData}
              setData={setAnnouncementData}
            />
          )}

          {selectedType === "resource" && (
            <ResourceForm data={resourceData} setData={setResourceData} />
          )}

          {selectedType === "assignment" && (
            <AssignmentForm data={assignmentData} setData={setAssignmentData} />
          )}

          {selectedType === "quiz" && (
            <QuizForm data={quizData} setData={setQuizData} />
          )}
          {errorMessage && (
            <div className="alert alert-danger mt-2 m-0">{errorMessage}</div>
          )}
          <button
            onClick={handleCreatePost}
            className="btn btn-primary w-100"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
