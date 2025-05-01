import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i class="bi bi-mortarboard-fill me-2 fs-4"></i>
            StudyHub
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-expanded="false"
            aria-controls="navbarNavDropdown"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <form class="col-12 col-lg-4 py-2 mb-lg-0">
              <input
                type="search"
                class="form-control form-control-dark"
                placeholder="Search..."
                aria-label="Search"
              />
            </form>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/courses">
                  Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/instructors">
                  Instructors
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <div class="">
                <Link to="/login">
                  <button
                    type="button"
                    class="btn btn-outline-dark me-2 mx-lg-2"
                  >
                    Log in
                  </button>
                </Link>
                <Link to="/sign-up">
                  <button type="button" class="btn btn-primary">
                    Sign up
                  </button>
                </Link>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
