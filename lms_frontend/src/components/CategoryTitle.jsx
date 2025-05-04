import { Link } from "react-router-dom";
import "../App.css";

function CategoryTitle({ title, link }) {
  return (
    <Link
      to={link}
      className="category-title text-decoration-none text-reset link-primary d-inline-block w-auto"
    >
      <h4 className="mb-4">
        {title}
        <span className="hover-arrow">
          <i className="bi bi-chevron-right"></i>
        </span>
      </h4>
    </Link>
  );
}

export default CategoryTitle;
