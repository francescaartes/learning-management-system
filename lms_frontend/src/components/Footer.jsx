import React from "react";

function Footer() {
  return (
    <>
      <div className="mt-5 border-top">
        <footer className="container py-3 my-4">
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            <li className="nav-item">
              <a href="#" className="nav-link px-2 text-reset">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 text-reset">
                Courses
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 text-reset">
                Instructors
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 text-reset">
                About
              </a>
            </li>
          </ul>
          <p className="text-center">© 2025 StudyHub, Inc</p>
        </footer>
      </div>
    </>
  );
}

export default Footer;
