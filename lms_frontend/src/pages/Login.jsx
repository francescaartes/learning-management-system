import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <>
      <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="mb-3">Login</h3>
          <form>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Log In
            </button>
          </form>
          <p className="mt-3 mb-0 text-center">
            Don't have an account? <Link to="/sign-up">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
