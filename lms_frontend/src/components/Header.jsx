import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ProfileDropdown from "../components/ProfileDropdown";
import HeaderMenu from "./HeaderMenu";
import Brand from "./Brand";

function Header() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/courses" },
  ];

  if (user) {
    navItems.push({ label: "Dashboard", to: "/dashboard" });
  }

  const userItems = [
    { label: "Profile", to: "/profile" },
    { label: "Settings", to: "/settings" },
    { label: "Logout", action: handleLogout },
  ];

  if (!user?.is_instructor) {
    navItems.push({ label: "Start Teaching", to: "/start_teaching" });
  }

  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top">
      <div className="container">
        <Brand />
        <div className="d-none d-lg-flex align-items-center ms-auto">
          <ul className="navbar-nav flex-row">
            {navItems.map((item) => (
              <li key={item.to} className="nav-item me-2 link-hover">
                <Link className="nav-link" to={item.to}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <ProfileDropdown userItems={userItems} />
          ) : (
            <>
              <Link to="/login">
                <button type="button" className="btn btn-outline-dark me-2">
                  Log in
                </button>
              </Link>
              <Link to="/sign-up">
                <button type="button" className="btn btn-primary">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>

        <HeaderMenu navItems={navItems} userItems={userItems} />
      </div>
    </nav>
  );
}

export default Header;
