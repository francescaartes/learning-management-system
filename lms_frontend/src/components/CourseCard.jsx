function CourseCard({ cardTitle }) {
  return (
    <>
      <div className="card">
        <a
          href=""
          className="category-title text-decoration-none text-reset link-primary d-inline-block w-auto"
        >
          <img src="react.svg" className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{cardTitle}</h5>
          </div>
        </a>
      </div>
    </>
  );
}

export default CourseCard;
