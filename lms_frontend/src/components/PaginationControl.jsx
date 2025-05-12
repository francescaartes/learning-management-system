function PaginationControl({ setPage, page, count, pageSize }) {
  const total_page = Math.ceil(count / pageSize);
  return (
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
              <button className="page-link" onClick={() => setPage(pageNum)}>
                {pageNum}
              </button>
            </li>
          );
        })}

        <li className={`page-item ${page === total_page ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => setPage(page + 1)}>
            <span>&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default PaginationControl;
