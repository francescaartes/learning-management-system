import React from "react";
import { Link } from "react-router-dom";

function Brand() {
  return (
    <>
      <Link className="navbar-brand text-primary" to="/">
        <i className="bi bi-mortarboard-fill me-2 fs-4"></i>
        <strong>StudyHub</strong>
      </Link>
    </>
  );
}

export default Brand;
