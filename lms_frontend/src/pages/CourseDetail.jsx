import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import EnrollButton from "../components/EnrollButton";
import StudentReviews from "../components/StudentReviews";
import api from "../api/api";

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCourse = async () => {
    try {
      const courseRes = await api.get(`courses/${courseId}`);
      setCourse(courseRes.data);
    } catch (err) {
      console.error("Fetch course error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      await api.patch(`courses/${course.id}/`, { is_published: false });
      navigate(`/edit-course/${course.id}`);
    } catch (err) {
      console.error("Unpublish failed:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/edit_course/${course.id}`);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`courses/${course.id}/`);
      setShowDeleteModal(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="position-sticky" style={{ top: "5rem" }}>
            <div className="card shadow-sm">
              {course.previewUrl && (
                <video controls className="card-img-top rounded-top">
                  <source src={course.previewUrl} type="video/mp4" />
                </video>
              )}
              <div className="card-body d-grid gap-3">
                <EnrollButton courseDetails={course} />
                {user?.id === course.instructor && (
                  <div className="d-grid gap-2">
                    <hr />
                    {course.is_published ? (
                      <button
                        onClick={handleUnpublish}
                        className="btn btn-outline-warning"
                      >
                        Unpublish & Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleEdit}
                          className="btn btn-outline-warning"
                        >
                          Edit Draft
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="btn btn-outline-danger"
                        >
                          Delete Course
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card mt-3 p-3 text-muted small shadow-sm">
              <div>
                <strong>Instructor:</strong> {course.instructor_name}
              </div>
              <div>
                <strong>Last updated:</strong>{" "}
                {new Date(course.updated_on).toLocaleDateString()}
              </div>
              <div>
                <strong>Language:</strong> {course.language}
              </div>
              <div>
                <strong>Rating:</strong>{" "}
                <i className="bi bi-star-fill text-warning me-1"></i>
                {course.average_rating} ({course.rating_count})
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm p-4">
            <h1 className="fw-bold mb-2">{course.title}</h1>
            <p className="lead text-muted">{course.description}</p>

            <hr />

            {course.learn?.length > 0 && (
              <section className="mb-4">
                <h5 className="fw-semibold">What You’ll Learn</h5>
                <ul className="list-group list-group-flush">
                  {course.learn.map((item, i) => (
                    <li key={i} className="list-group-item ps-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {course.topics?.length > 0 && (
              <section className="mb-4">
                <h5 className="fw-semibold">Topics Covered</h5>
                <div className="d-flex flex-wrap gap-2">
                  {course.topics.map((topic, i) => (
                    <span key={i} className="badge bg-dark-subtle text-dark">
                      {topic}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {course.requirements?.length > 0 && (
              <section className="mb-4">
                <h5 className="fw-semibold">Requirements</h5>
                <ul className="list-group list-group-flush">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="list-group-item ps-0">
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {course.inclusion?.length > 0 && (
              <section className="mb-4">
                <h5 className="fw-semibold">Course Includes</h5>
                <ul className="list-group list-group-flush">
                  {course.inclusion.map((item, i) => (
                    <li key={i} className="list-group-item ps-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="mt-5">
            <h4 className="fw-semibold mb-3">Student Reviews</h4>
            <StudentReviews courseId={course.id} />
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to permanently delete this course? This
                  action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetail;
