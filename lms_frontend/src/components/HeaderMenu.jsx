import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Brand from "./Brand";

function HeaderMenu({ navItems, userItems }) {
  const { user } = useUser();

  const closeOffcanvas = () => {
    const closeBtn = document.querySelector("#mobileMenu .btn-close");
    if (closeBtn) closeBtn.click(); // simulate user click to close
  };

  return (
    <>
      <div className="d-flex d-lg-none ms-auto">
        <button
          className="btn"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu"
          aria-controls="mobileMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      <div
        className="offcanvas d-lg-none offcanvas-end w-75"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
      >
        <div className="offcanvas-header">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="d-flex align-items-center">
              {user ? (
                <>
                  <img
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      maxWidth: "3rem",
                      borderRadius: "50%",
                    }}
                    className="border me-2"
                    src={user.profile_img}
                    alt={user.first_name}
                  />
                  <h5 id="mobileMenuLabel" className="m-0">
                    {user.first_name} {user.last_name}
                  </h5>
                </>
              ) : (
                <Brand onClick={closeOffcanvas} />
              )}
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            {navItems.map((item) => (
              <li key={item.to} className="nav-item">
                <Link
                  className="nav-link"
                  to={item.to}
                  onClick={closeOffcanvas}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="nav-item mt-3">
              {user ? (
                <>
                  <hr />
                  {userItems.map((item, idx) => (
                    <li key={idx} className="nav-item">
                      {item.to ? (
                        <Link
                          className="nav-link"
                          to={item.to}
                          onClick={closeOffcanvas}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            item.action;
                            closeOffcanvas();
                          }}
                          className="btn btn-link nav-link text-start text-danger"
                        >
                          {item.label}
                        </button>
                      )}
                    </li>
                  ))}
                </>
              ) : (
                <li className="nav-item mt-3">
                  <Link to="/login" onClick={closeOffcanvas}>
                    <button className="btn btn-outline-dark w-100 mb-2">
                      Log in
                    </button>
                  </Link>
                  <Link to="/sign-up" onClick={closeOffcanvas}>
                    <button className="btn btn-primary w-100">Sign up</button>
                  </Link>
                </li>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default HeaderMenu;
