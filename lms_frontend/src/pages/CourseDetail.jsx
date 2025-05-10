import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EnrollButton from "../components/EnrollButton";
import api from "../api/api";

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [seeMore, setSeeMore] = useState({});

  const fetchReviews = async () => {
    try {
      const reviewRes = await api.get(`reviews/?course=${courseId}`);
      setReviews(reviewRes.data);
    } catch (err) {
      console.log("Fetch reviews error", err);
      setReviews({});
    }
  };

  const fetchCourse = async () => {
    try {
      const courseRes = await api.get(`courses/${courseId}`);
      setCourse(courseRes.data);
      console.log("Course:", courseRes.data);
    } catch (err) {
      console.log("Fetch course error", err);
      setCourse({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchReviews();
  }, [courseId]);

  const toggleSeeMore = (id) => {
    setSeeMore((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8">
          <h2>{course.title}</h2>
          <p className="text-muted">By {course.instructor_name}</p>
          <p>{course.description}</p>

          <ul className="list-inline text-muted">
            <li className="list-inline-item">
              Rating:<i className="ms-1 bi bi-star-fill text-warning"></i>{" "}
              {course.average_rating} ({course.rating_count})
            </li>
            {/* <li className="list-inline-item">• {totalStudents} students</li> */}
            <li className="list-inline-item">
              • Last updated: {new Date(course.updated_on).toLocaleDateString()}
            </li>
            <li className="list-inline-item">• Language: {course.language}</li>
          </ul>

          <hr />

          <h5>What you'll learn</h5>
          <ul>
            {course.learn?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h5>Topics covered</h5>
          <div className="d-flex flex-wrap gap-2 w-75">
            {course.topics?.map((topic, index) => (
              <span key={index} className="badge bg-secondary">
                {topic}
              </span>
            ))}
          </div>

          <h5 className="mt-4">Requirements</h5>
          <ul>
            {course.requirements?.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>

          <h5 className="mt-4">Course Includes</h5>
          <ul>
            {course.inclusion?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="col-lg-4">
          <div className="card mb-3">
            <video controls width="100%">
              <source src={course.previewUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="card-body">
              <EnrollButton courseDetails={course} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h5 className="mt-4 mb-3">Student Reviews</h5>
        {reviews.length > 0 ? (
          <div className="row g-4">
            {reviews.map((review) => (
              <div key={review.id} className="col-sm-12 col-md-6 col-lg-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={review.user.profile_img}
                      alt={review.user.username}
                      style={{
                        aspectRatio: "1/1",
                        objectFit: "cover",
                        maxWidth: "3rem",
                        borderRadius: "50%",
                      }}
                      className="border me-2"
                    />
                    <div className="m-0 p-0 d-flex flex-column justify-content-center">
                      <h6 className="p-0 m-0">
                        {review.user.first_name} {review.user.last_name}
                      </h6>
                      <p className="m-0 p-0 text-muted">
                        <i className="ms-1 bi bi-star-fill text-warning me-1"></i>
                        {review.rating}/5
                      </p>
                    </div>
                  </div>
                  <p>
                    {seeMore[review.id]
                      ? review.comment
                      : `${review.comment.substring(0, 150)}...`}
                    <a
                      className="h-auto w-auto ms-2 m-0 p-0 text-black"
                      onClick={() => toggleSeeMore(review.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {seeMore[review.id] ? "See less" : "See more"}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No reviews yet.</div>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
