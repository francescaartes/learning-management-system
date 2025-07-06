import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useUser } from "../contexts/UserContext";
import ToDoList from "../components/ToDoList";
import { Link } from "react-router-dom";

function StudentDashboard() {
  const { user } = useUser();
  const [enrollments, setEnrollments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch enrolled courses and announcements concurrently
      const [enrollRes, annRes] = await Promise.all([
        api.get("enrollments/"),
        api.get("my_announcements/"),
      ]);

      setEnrollments(enrollRes.data.results || enrollRes.data);
      setAnnouncements(annRes.data.results || annRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <div className="mt-3">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Learning Dashboard</h2>

      <div className="row">
        {/* Main content */}
        <div className="col-lg-8 mb-4">
          <h4 className="mb-3">Your Enrolled Courses</h4>
          {enrollments.length > 0 ? (
            <div className="row g-4">
              {enrollments.map((enroll) => (
                <div key={enroll.id} className="col-md-5">
                  <div className="card h-100 shadow-sm">
                    <Link
                      to={`/courses/${enroll.course.id}`}
                      className="btn mt-auto"
                    >
                      <img
                        src={enroll.course.thumbnail}
                        alt={enroll.course.title}
                        className="card-img-top"
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{enroll.course.title}</h5>
                        <p className="card-text text-muted mb-2">
                          {enroll.course.instructor_name}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">
              You are not enrolled in any courses yet.
            </p>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4 d-flex flex-column gap-4">
          <ToDoList />

          {/* Announcements */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Announcements</h5>
              {announcements.length === 0 ? (
                <p className="text-muted">No announcements.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {announcements.map((a) => (
                    <li
                      key={a.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{a.title}</span>
                      <Link
                        to={`/posts/${a.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
