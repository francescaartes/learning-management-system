import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseCarousel from "../components/CourseCarousel";
import api from "../api/api";

function Courses() {
  const [groupedCourses, setGroupedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupedCourses = async () => {
    try {
      const catRes = await api.get("categories/?used=true");
      const categoriesData = catRes.data;
      console.log("Categories:", categoriesData);

      const courses = categoriesData.map((cat) =>
        api.get(`courses/?category=${cat.id}&is_published=true`)
      );

      const courseResponse = await Promise.all(courses);
      console.log(
        "Courses:",
        courseResponse.map((data) => data.data.results)
      );

      const grouped = {};
      categoriesData.forEach((cat, id) => {
        grouped[cat.name] = courseResponse[id].data.results;
      });
      console.log("Grouped data:", grouped);

      setGroupedCourses(grouped);
    } catch (err) {
      console.log("Error fetching courses/categories:", err);
      setGroupedCourses({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedCourses();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="container">
      <h4 className="my-4">Courses</h4>
      {Object.entries(groupedCourses).map(([category, courses]) => (
        <div key={category} className="mb-4">
          <h5 className="mb-3">{category}</h5>
          <CourseCarousel courses={courses} />
        </div>
      ))}
    </div>
  );
}

export default Courses;
