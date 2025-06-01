import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import CourseCard from "../components/CourseCard";
import api from "../api/api";

function InstructorDashboard() {
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [draftCourses, setDraftCourses] = useState([]);
  const { user } = useUser();

  const fetchCourses = async () => {
    try {
      const res = await api.get(`courses/?instructor=${user.id}`);
      const allCourses = res.data || [];

      console.log(res.data);

      const published = allCourses.filter((course) => course.is_published);
      const drafts = allCourses.filter((course) => !course.is_published);

      setPublishedCourses(published);
      setDraftCourses(drafts);
    } catch (err) {
      console.log("Fetch courses error:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="mt-1">
      <div
        className="d-flex flex-column justify-content-center align-items-center gap-2 border rounded"
        style={{ height: "8rem" }}
      >
        <h4 className="d-flex align-items-center gap-2">
          Jump Into Course Creation
        </h4>
        <Link to={"/create_course"} className="m-0 p-0">
          <button className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            <span>Create Course</span>
          </button>
        </Link>
      </div>

      <h4 className="mt-4">Published Courses</h4>
      <div className="row g-4">
        {publishedCourses.length > 0 ? (
          publishedCourses.map((course) => (
            <div key={course.id} className="col-lg-2 col-md-4 col-sm-6">
              <CourseCard course={course} />
            </div>
          ))
        ) : (
          <p>No published courses yet.</p>
        )}
      </div>

      <h4 className="mt-5">Draft Courses</h4>
      <div className="row g-4">
        {draftCourses.length > 0 ? (
          draftCourses.map((course) => (
            <div key={course.id} className="col-lg-2 col-md-4 col-sm-6">
              <CourseCard course={course} />
            </div>
          ))
        ) : (
          <p>No drafts saved.</p>
        )}
      </div>
    </div>
  );
}

export default InstructorDashboard;
