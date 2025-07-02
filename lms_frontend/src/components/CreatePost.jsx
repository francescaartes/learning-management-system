import { useState } from "react";
import AnnouncementForm from "./CreatePost/AnnouncementForm";
import ResourceForm from "./CreatePost/ResourceForm";
import QuizForm from "./CreatePost/QuizForm";
import AssignmentForm from "./CreatePost/AssignmentForm";
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

      console.log("Post created!");
      setNewPost({ title: "", type: "announcement", course: courseId });
      setAnnouncementData({ message: "" });
      setResourceData({ description: "" });
      setAssignmentData({
        instructions: "",
        due_date: "",
        max_score: 0,
        submission_type: "",
      });
      setQuizData({
        instructions: "",
        due_date: "",
        questions: [],
      });
    } catch (err) {
      console.error("Post creation error", err.response?.data || err);
      console.error(JSON.stringify(err.response?.data, null, 2));
    } finally {
      setCreating(false);
      window.location.reload();
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
