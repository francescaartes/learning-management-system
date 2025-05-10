import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EnrollButton from "../components/EnrollButton";
import api from "../api/api";
import StudentReviews from "../components/StudentReviews";

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);

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
  }, [courseId]);

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
            {course.inclusion?.map((item, id) => (
              <li key={id}>{item}</li>
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
        <StudentReviews courseId={course.id} />
      </div>
    </div>
  );
}

export default CourseDetail;
