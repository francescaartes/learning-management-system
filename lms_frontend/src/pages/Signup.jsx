import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        userData
      );
      console.log(response.data);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      if (data?.username) {
        setError("Username already taken.");
        console.log(error);
      } else {
        setError("Signup failed.");
        console.log(error);
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="mb-3">Create an account</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">First Name</label>
              <input
                name="first_name"
                type="text"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label">Last Name</label>
              <input
                name="last_name"
                type="text"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
          </div>
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
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
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
          <button
            type="submit"
            className="btn btn-primary w-100"
            onChange={handleChange}
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mb-0 mt-3 text-danger">
          {error ? error : ""}
        </p>
        <p className="mt-3 mb-0 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
