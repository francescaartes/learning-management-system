import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import api from "../api/api";
import Modal from "../components/Modal";

import Announcement from "../components/PostType/Announcement";
import Resource from "../components/PostType/Resource";
import Assignment from "../components/PostType/Assignment";
import Quiz from "../components/PostType/Quiz";
import AssignmentSubmissionForm from "../components/AssignmentSubmissionForm";
import AssignmentSubmissionsList from "../components/AssignmentSubmissionList";

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await api.get(`posts/${postId}/`);
      setPost(res.data);
    } catch (err) {
      console.error("Fetch post error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`posts/${postId}/`);
      setShowDeleteModal(false);
      navigate(-1);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) return <div className="container py-4">Loading...</div>;

  if (!post) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Post not found.</div>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const typeColors = {
    announcement: "primary",
    resource: "info",
    assignment: "warning",
    quiz: "success",
  };

  return (
    <div className="container my-4">
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card shadow-sm text-center">
            <div
              className={`badge bg-${
                typeColors[post.type] || "secondary"
              } m-3 py-2`}
            >
              {post.type.toUpperCase()}
            </div>
            <div className="card-body">
              <h5 className="fw-bold">{post.title}</h5>
              <small className="text-muted">
                {new Date(post.created_on).toLocaleString()}
              </small>
              {user?.id === post.author && (
                <>
                  <hr />
                  <div className="d-grid gap-2">
                    <button
                      onClick={() => navigate(`/edit_post/${post.postId}`)}
                      className="btn btn-outline-warning"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="btn btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {post.type === "assignment" && user?.id === post.author && (
            <div className="card shadow-sm mt-4">
              <AssignmentSubmissionsList assignmentId={post.assignment.id} />
            </div>
          )}
        </div>

        <div className="col-lg-9">
          <div className="card shadow-sm p-4">
            {post.type === "announcement" && <Announcement post={post} />}
            {post.type === "resource" && <Resource post={post} />}
            {post.type === "assignment" && <Assignment post={post} />}
            {post.type === "quiz" && (
              <Quiz
                post={post}
                showGoToQuizButton={true}
                isInstructor={user?.id === post.author}
              />
            )}
          </div>

          {post.type === "assignment" && user?.id !== post.author && (
            <AssignmentSubmissionForm
              assignmentId={post.assignment.id}
              submissionType={post.assignment.submission_type}
            />
          )}
        </div>
      </div>

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post"
        body="Are you sure you want to delete this post? This cannot be undone."
        confirmText="Yes, Delete"
        confirmClass="btn-danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default PostDetail;
