import { useState } from "react";
import AnnouncementForm from "./CreatePost/AnnouncementForm";
import api from "../api/api";

function CreatePost({ courseId }) {
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
    file: "",
    link: "",
    description: "",
  });
  const [assignmentData, setAssignmentData] = useState({
    instructions: "",
    due_date: "",
    max_score: 0,
    submission_type: "",
  });
  const [quizData, setQuizData] = useState({
    instructions: "",
    due_date: "",
    questions: [],
  });

  const [creating, setCreating] = useState(false);

  const handleCreatePost = async (e) => {
    setCreating(true);

    const postData = {
      ...newPost,
      type: selectedType,
      [selectedType]: {
        ...(selectedType === "announcement" && announcementData),
        ...(selectedType === "resource" && resourceData),
        ...(selectedType === "assignment" && assignmentData),
        ...(selectedType === "quiz" && {
          ...quizData,
          questions: quizData.questions.map((q) => ({
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
          })),
        }),
      },
    };

    console.log(postData);

    try {
      await api.post(`posts/`, postData);
      console.log("Post created!");
      setNewPost({ title: "", type: "announcement", course: courseId });
    } catch (err) {
      console.error("Post creation error", err.response?.data || err);
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

        <form onSubmit={handleCreatePost} className="d-flex flex-column gap-3">
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

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
