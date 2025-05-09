import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import CourseCarousel from "../components/CourseCarousel";
import CategoryTitle from "../components/CategoryTitle";

function Home() {
  const { user } = useUser();
  const [courses, setCourses] = useState({});

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/courses/");
      setCourses(response.data);
      console.log(response.data);
    } catch (err) {
      console.log("Error Fetching Courses:", err);
      setCourses({});
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <>
      <section
        className="bg-light py-5 text-center"
        style={{ height: "30rem" }}
      >
        <div className="container d-flex flex-column align-items-center justify-content-center h-100">
          <h1>
            <strong>
              {user
                ? `Welcome, ${user.first_name || user.username}!`
                : "Welcome to StudyHub"}
            </strong>
          </h1>
          <p className="lead">
            {user
              ? "Let's continue your learning journey."
              : "Your personalized learning management system"}
          </p>
          {!user && (
            <Link to="/sign-up" className="btn btn-primary mt-3 min">
              Get Started
            </Link>
          )}
        </div>
      </section>
      <section className="container">
        <div className="my-4 ps-3 p-0 d-flex align-items-center">
          <CategoryTitle title="What to learn next" link="/courses" />
        </div>
        <CourseCarousel courses={courses} />
      </section>
    </>
  );
}

export default Home;
