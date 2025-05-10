import { useState, useEffect } from "react";
import api from "../api/api";

function StudentReviews({ courseId }) {
  const initialPageSize = window.innerWidth <= 990 ? 4 : 3;

  const [reviews, setReviews] = useState({});
  const [seeMore, setSeeMore] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get(
        `reviews/?page=${page}&page_size=${pageSize}&course=${courseId}`
      );
      setReviews(res.data.results);
      setCount(res.data.count);
      setCurrentPage(page);
    } catch (err) {
      console.log("Fetch reviews error", err);
      setReviews({});
    } finally {
      setLoading(false);
    }
  };

  const toggleSeeMore = (id) => {
    setSeeMore((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    setLoading(true);
    fetchReviews();
  }, [page, pageSize]);

  useEffect(() => {
    const determinePageSize = () => {
      const width = window.innerWidth;
      if (width <= 990) {
        setPageSize(4);
      } else {
        setPageSize(3);
      }
    };

    window.addEventListener("resize", determinePageSize);
    return () => window.removeEventListener("resize", determinePageSize);
  }, []);

  const total_page = Math.ceil(count / pageSize);

  return (
    <div>
      {reviews.length > 0 ? (
        <>
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
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>
                  <span>&laquo;</span>
                </button>
              </li>
              {[...Array(total_page)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <li
                    key={pageNum}
                    className={`page-item ${pageNum === page ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}

              <li
                className={`page-item ${page === total_page ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(page + 1)}>
                  <span>&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <div>No reviews yet.</div>
      )}
    </div>
  );
}

export default StudentReviews;
