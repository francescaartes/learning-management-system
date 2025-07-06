import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import CourseCard from "../components/CourseCard";
import api from "../api/api";

function InstructorDashboard() {
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [draftCourses, setDraftCourses] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const { user } = useUser();

  const fetchCourses = async () => {
    try {
      const res = await api.get(`courses/?instructor=${user.id}`);
      const allCourses = res.data || [];

      const published = allCourses.filter((course) => course.is_published);
      const drafts = allCourses.filter((course) => !course.is_published);

      setPublishedCourses(published);
      setDraftCourses(drafts);
    } catch (err) {
      console.log("Fetch courses error:", err);
    }
  };

  const fetchRecentSubmissions = async () => {
    try {
      const res = await api.get(`submissions/recent/`);
      setRecentSubmissions(res.data.results);
      console.log(res.data.results);
    } catch (err) {
      console.log("Fetch submissions error:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchRecentSubmissions();
  }, []);

  return (
    <div className="container py-4">
      <div className="p-4 mb-4 text-center bg-light border rounded">
        <h4 className="mb-3">Ready to build something new?</h4>
        <Link to="/create_course">
          <button className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            <span>Create Course</span>
          </button>
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <h4 className="mb-3">Published Courses</h4>
          {publishedCourses.length > 0 ? (
            <div className="row g-3">
              {publishedCourses.map((course) => (
                <div key={course.id} className="col-md-4">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">You haven't published any courses yet.</p>
          )}

          <h4 className="mt-5 mb-3">Draft Courses</h4>
          {draftCourses.length > 0 ? (
            <div className="row g-3">
              {draftCourses.map((course) => (
                <div key={course.id} className="col-md-4">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">You have no draft courses saved.</p>
          )}
        </div>

        <div className="col-lg-4">
          <h4 className="mb-3">Recent Submissions</h4>
          {recentSubmissions.length > 0 ? (
            <ul className="list-group">
              {recentSubmissions.slice(0, 5).map((submission) => (
                <li
                  key={submission.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{submission.assignment_title}</strong>
                    <div className="small text-muted">
                      by {submission.student_full_name}
                    </div>
                  </div>
                  <Link
                    to={`/assignments/${submission.assignment}/submissions`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No recent submissions.</p>
          )}

          <h4 className="mt-4 mb-3">Quick Actions</h4>
          <div className="d-grid gap-2">
            <Link to="/create_course" className="btn btn-outline-primary">
              <i className="bi bi-journal-plus me-2"></i>
              New Course
            </Link>
            <Link to="/courses" className="btn btn-outline-secondary">
              <i className="bi bi-grid me-2"></i>
              Manage All Courses
            </Link>
            <Link to="/grades" className="btn btn-outline-secondary">
              <i className="bi bi-clipboard-check me-2"></i>
              Grade Submissions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
