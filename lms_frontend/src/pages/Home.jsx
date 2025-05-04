import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import CourseCarousel from "../components/CourseCarousel";

function Home() {
  const { user } = useUser();
  const [courses, setCourses] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/courses/");
      setCourses(response.data);
      console.log(response.data);
    } catch {}
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <>
      <section className="bg-light py-5 text-center">
        <div className="container">
          <h1 className="display-5">
            {user
              ? `Welcome, ${user.first_name || user.username}!`
              : "Welcome to StudyHub"}
          </h1>
          <p className="lead">
            {user
              ? "Let's continue your learning journey."
              : "Your personalized learning management system"}
          </p>
          {!user && (
            <Link to="/sign-up" className="btn btn-primary mt-3">
              Get Started
            </Link>
          )}
        </div>
      </section>
      <CourseCarousel courses={courses} />
    </>
  );
}

export default Home;
