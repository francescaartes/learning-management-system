import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import EnrollButton from "../components/EnrollButton";
import StudentReviews from "../components/StudentReviews";
import Modal from "../components/Modal";
import api from "../api/api";

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

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
      navigate("/dashboard");
    } catch (err) {
      console.error("Unpublish failed:", err);
    }
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

  const handlePublish = async () => {
    try {
      await api.patch(`courses/${course.id}/`, { is_published: true });
      navigate("/dashboard");
    } catch (err) {
      console.error("Publish failed:", err);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container my-4">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="position-sticky" style={{ top: "5rem" }}>
            <div className="card shadow-sm">
              <div>
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
              </div>
              <div className="card-body d-grid">
                <EnrollButton courseDetails={course} />
                {user?.id === course.instructor && (
                  <div className="d-grid">
                    {course.is_published ? (
                      <>
                        <hr />
                        <div className="d-flex">
                          <hr />
                          <button
                            onClick={() => setShowUnpublishModal(true)}
                            className="btn btn-outline-warning w-100"
                          >
                            Unpublish
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <hr />
                        <div className="d-flex justify-content-around gap-2">
                          <button
                            onClick={() =>
                              navigate(`/edit_course/${course.id}`)
                            }
                            className="btn btn-outline-warning w-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="btn btn-outline-danger w-100"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowPublishModal(true)}
                            className="btn btn-outline-success w-100"
                          >
                            Publish
                          </button>
                        </div>
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
                <strong>Enrolled: </strong>
                {course.enrollment_count || 0} Students
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

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        body="Are you sure you want to permanently delete this course? This action cannot be undone."
        confirmText="Delete Course"
        confirmClass="btn-danger"
        onConfirm={handleDelete}
      />

      <Modal
        show={showUnpublishModal}
        onClose={() => setShowUnpublishModal(false)}
        title="Unpublish Course"
        body="Are you sure you want to unpublish this course? Students will no longer see it."
        confirmText="Yes, Unpublish"
        confirmClass="btn-warning"
        onConfirm={handleUnpublish}
      />

      <Modal
        show={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Publish Course"
        body="Are you sure you want to publish this course? It will be visible to students."
        confirmText="Yes, Publish"
        confirmClass="btn-success"
        onConfirm={handlePublish}
      />
    </div>
  );
}

export default CourseDetail;
