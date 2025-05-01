import { Link } from "react-router-dom";

function CourseCard({ courseTitle, img, courseId }) {
  return (
    <>
      <div className="card">
        <Link
          to={`/course/${courseId}`}
          className="category-title text-decoration-none text-reset link-primary d-inline-block w-auto"
        >
          <img src={img} className="card-img-top" alt={courseTitle} />
          <div className="card-body">
            <h5 className="card-title">{courseTitle}</h5>
          </div>
        </Link>
      </div>
    </>
  );
}

export default CourseCard;
