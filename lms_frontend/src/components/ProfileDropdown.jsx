import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function ProfileDropdown({ userItems }) {
  const { user } = useUser();

  return (
    <div className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle d-flex align-items-center"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          style={{
            aspectRatio: "1/1",
            objectFit: "cover",
            maxWidth: "2.5rem",
            borderRadius: "50%",
          }}
          className="border"
          src={user.profile_img}
          alt={user.first_name}
        />
      </a>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="navbarDropdown"
      >
        {userItems.map((item, idx) => (
          <li key={idx}>
            {item.to ? (
              <Link className="dropdown-item" to={item.to}>
                {item.label}
              </Link>
            ) : (
              <>
                <hr className="m-2" />
                <button
                  className="dropdown-item text-danger"
                  onClick={item.action}
                >
                  {item.label}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfileDropdown;
