import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import CreatePost from "../components/CreatePost";

function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingPost, setCreatingPost] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`courses/${courseId}/`);
      setCourse(res.data);
    } catch (err) {
      console.error("Course fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get(`posts/?course=${courseId}`);
      setPosts(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Post fetch error", err);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchPosts();
  }, [courseId]);

  const isInstructor = course?.instructor?.id === api.getCurrentUserId?.();

  const typeColors = {
    announcement: "primary",
    resource: "info",
    assignment: "warning",
    quiz: "success",
  };

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
                  <div
                    key={post.id}
                    className="card mb-3 shadow-sm"
                    style={{ maxHeight: "30rem" }}
                  >
                    <a href={``} className="text-decoration-none text-black">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <span
                            className={`badge bg-${
                              typeColors[post.type] || "secondary"
                            }`}
                          >
                            {post.type.toUpperCase()}
                          </span>
                          <small className="text-muted">
                            {new Date(post.created_on).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </small>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <h5 className="mt-2 mb-0">{post.title}</h5>
                          {post.type === "announcement" && (
                            <div className="">
                              <div>
                                <p
                                  className="m-0 html-content"
                                  dangerouslySetInnerHTML={{
                                    __html: post.announcement.message,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {post.type === "quiz" && (
                            <div className="">
                              <div>
                                <p className="m-0">
                                  <strong>Number of items: </strong>
                                  {post.quiz.questions.length}
                                </p>
                                <p className="m-0">
                                  <strong>Due date: </strong>
                                  {new Date(post.quiz.due_date).toLocaleString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </p>
                                <p className="m-0 mt-2">
                                  {post.quiz.instructions}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
