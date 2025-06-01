import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import api from "../api/api";
import CourseCard from "../components/CourseCard";

function Profile() {
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [loadingE, setLoadingE] = useState(true);
  const [loadingP, setLoadingP] = useState(true);

  const fetchEnrolledCourses = async () => {
    try {
      const res = await api.get("enrollments/");
      setEnrolledCourses(res.data || []);
    } catch (err) {
      console.error("Enrolled courses error:", err);
    } finally {
      setLoadingE(false);
    }
  };

  const fetchPublishedCourses = async () => {
    try {
      const res = await api.get(
        `courses/?instructor=${user.id}&is_published=true`
      );
      setPublishedCourses(res.data || []);
    } catch (err) {
      console.error("Published courses error:", err);
    } finally {
      setLoadingP(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    if (user.is_instructor) {
      fetchPublishedCourses();
    }
  }, [user.is_instructor, user.id]);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center">
        <img
          style={{
            aspectRatio: "1/1",
            objectFit: "cover",
            maxWidth: "10rem",
            width: "40%",
            borderRadius: "50%",
          }}
          className="border me-4"
          src={user.profile_img}
          alt={user.first_name}
        />
        <div>
          <h4 className="mt-4 m-0">
            {user.first_name} {user.last_name}
          </h4>
          <h6 className="text-muted">@{user.username}</h6>
        </div>
      </div>

      <p className="mt-4">{user.bio}</p>
      <hr />

      {user.is_instructor && (
        <>
          <h4 className="my-4">Published Courses</h4>
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
        </>
      )}

      <h4 className="my-4">Enrolled Courses</h4>
      <div className="row g-4">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((enroll) => (
            <div key={enroll.course.id} className="col-lg-2 col-md-4 col-sm-6">
              <CourseCard course={enroll.course} />
            </div>
          ))
        ) : (
          <p>No enrolled courses yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
