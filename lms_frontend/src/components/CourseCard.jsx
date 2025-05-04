import React from "react";

function CourseCard({ course }) {
  return (
    <>
      <a
        href={`courses/${course.id}`}
        className="w-100 text-decoration-none"
        target="_blank"
      >
        <div className="card h-100 shadow-sm">
          <img
            src={course.thumbnail}
            className="card-img-top"
            alt={course.title}
            style={{ aspectRatio: "3/2", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">{course.title}</h5>
            <p className="mb-1 text-muted">{course.instructor_name}</p>
            <p className="mb-2 text-muted">
              <i className="bi bi-star-fill text-warning"></i>{" "}
              {course.average_rating} ({course.rating_count})
            </p>
            <p className="fw-bold mb-0 text-primary">
              {course.price == 0 ? "FREE" : `$${course.price}`}
            </p>
          </div>
        </div>
      </a>
    </>
  );
}

export default CourseCard;
