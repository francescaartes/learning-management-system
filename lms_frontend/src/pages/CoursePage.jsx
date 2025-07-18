import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import CreatePost from "../components/CreatePost";
import { useUser } from "../contexts/UserContext";
import PostCard from "../components/PostCard";
import Modal from "../components/Modal";
import ToDoList from "../components/ToDoList";
import EnrolledStudentsCard from "../components/EnrolledStudentsCard";

function CoursePage() {
  const { user } = useUser();
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingPost, setCreatingPost] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`courses/${courseId}/`);
      setCourse(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Course fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const isInstructor = course.instructor === user.id;

  const fetchPosts = async () => {
    try {
      const res = await api.get(`posts/?course=${courseId}`);
      setPosts(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Post fetch error", err);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`posts/${postToDelete.id}/`);
      fetchPosts();
    } catch (err) {
      console.log("Delete post error", err);
    } finally {
      setPostToDelete(null);
    }
  };

  const handleEdit = async () => {};

  useEffect(() => {
    fetchCourse();
    fetchPosts();
  }, [courseId]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            {course.previewUrl ? (
              <video controls className="card-img-top">
                <source src={course.previewUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="card-img-top"
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{course.title}</h5>
              <p className="text-muted small">{course.description}</p>
              <hr />
              <p>
                <i className="bi bi-person-fill me-2"></i>
                <strong>Instructor:</strong> {course.instructor_name || "N/A"}
              </p>
              <p>
                <i className="bi bi-people-fill me-2"></i>
                <strong>Enrolled:</strong> {course.enrollment_count || 0}{" "}
                Students
              </p>
              {isInstructor && (
                <button
                  className={`btn w-100 mt-3 ${
                    creatingPost ? "btn-outline-primary" : "btn-primary"
                  }`}
                  onClick={() => setCreatingPost(!creatingPost)}
                >
                  {creatingPost ? "Course Stream" : "Create Post"}
                </button>
              )}
            </div>
          </div>
          {!isInstructor && <ToDoList courseId={courseId} />}
          {isInstructor && <EnrolledStudentsCard courseId={courseId} />}
        </div>

        <div className="col-lg-8">
          {creatingPost ? (
            <CreatePost
              courseId={courseId}
              onPostCreated={fetchPosts}
              onCancel={() => setCreatingPost(false)}
            />
          ) : (
            <>
              {posts.length === 0 ? (
                <div className="text-muted text-center">No posts yet.</div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="mb-4">
                    <PostCard
                      post={post}
                      isInstructor={isInstructor}
                      handleDelete={() => setPostToDelete(post)}
                      handleEdit={handleEdit}
                    />
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        show={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        title="Confirm Delete"
        body={`Are you sure you want to permanently delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Post"
        confirmClass="btn-danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default CoursePage;
