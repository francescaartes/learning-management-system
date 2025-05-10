import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import api from "../api/api";

function Login() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { fetchUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("token/", userData);

      const { access, refresh } = response.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const user = jwtDecode(access);
      console.log("Logged in user:", user);

      await fetchUser();
      navigate("/dashboard");
    } catch (err) {
      setError("Incorrect password or username.");
    }
  };

  return (
    <>
      <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="mb-3">Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                name="username"
                type="text"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Log In
            </button>
          </form>
          <p className="text-center mb-0 pt-2 text-danger">
            {error ? error : ""}
          </p>
          <p className="mt-2 mb-0 text-center">
            Don't have an account? <Link to="/sign-up">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
