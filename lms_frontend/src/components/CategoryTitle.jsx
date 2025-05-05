import { Link } from "react-router-dom";
import "../App.css";

function CategoryTitle({ title, link }) {
  return (
    <Link
      to={link}
      className="category-title text-decoration-none text-reset link-primary d-inline-block w-auto m-0"
    >
      <h4 className="m-0">
        {title}
        <span className="hover-arrow">
          <i className="bi bi-chevron-right"></i>
        </span>
      </h4>
    </Link>
  );
}

export default CategoryTitle;
