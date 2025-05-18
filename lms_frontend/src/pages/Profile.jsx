import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import api from "../api/api";
import CourseCard from "../components/CourseCard";
import PaginationControl from "../components/PaginationControl";

function Profile() {
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [publishedCourses, setPublishedCourses] = useState({});
  const [loadingE, setLoadingE] = useState(true);
  const [loadingP, setLoadingP] = useState(true);

  const [pageE, setPageE] = useState(1);
  const [pageSizeE, setPageSizeE] = useState(8);
  const [countE, setCountE] = useState(0);

  const [pageP, setPageP] = useState(1);
  const [pageSizeP, setPageSizeP] = useState(8);
  const [countP, setCountP] = useState(0);

  const fetchEnrolledCourses = async () => {
    try {
      const enrolledRes = await api.get(
        `enrollments/?pageE=${pageE}&page_size=${pageSizeE}`
      );
      console.log(enrolledRes);

      setCountE(enrolledRes.data.countE);
      setEnrolledCourses(enrolledRes.data.results);
    } catch (err) {
      console.log("Enrolled courses error:", err);
    } finally {
      setLoadingE(false);
    }
  };

  const fetchPublishedCourses = async () => {
    try {
      const publishedRes = await api.get(
        `courses/?instructor=${user.id}&page=${pageP}&page_size=${pageSizeP}`
      );
      setPublishedCourses(publishedRes.data.results);
      setCountP(publishedRes.data.count);
    } catch (err) {
      console.log("Published courses error:", err);
    } finally {
      setLoadingP(false);
    }
  };

  useEffect(() => {
    setLoadingE(true);
    fetchEnrolledCourses();
  }, [pageE, pageSizeE]);

  useEffect(() => {
    if (user.is_instructor) {
      fetchPublishedCourses();
      setLoadingP(true);
    }
  }, [pageP, pageSizeP]);

  const total_pageE = Math.ceil(countE / pageSizeE);
  const total_pageP = Math.ceil(countP / pageSizeP);

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
        <hr />
      </div>
      <p className="mt-4">{user.bio}</p>
      <hr />
      {user.is_instructor ? (
        <>
          <h4 className="my-4">Published Courses</h4>
          <div className="row g-4">
            {publishedCourses.length > 0 ? (
              publishedCourses.map((course) => (
                <div key={course.id} className="col-lg-3 col-md-6 col-sm-6">
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <p>No published courses yet.</p>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      {total_pageP > 1 && (
        <PaginationControl
          page={pageP}
          setPage={setPageP}
          count={countP}
          pageSize={pageSizeP}
        />
      )}
      {user.is_instructor && enrolledCourses.length == 0 ? (
        <></>
      ) : (
        <>
          <h4 className="my-4">Enrolled Courses</h4>
          <div className="row g-4">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((courses) => (
                <div
                  key={courses.course.id}
                  className="col-lg-3 col-md-6 col-sm-6"
                >
                  <CourseCard course={courses.course} />
                </div>
              ))
            ) : (
              <p>No enrolled courses yet.</p>
            )}
          </div>
          {total_pageE > 1 && (
            <PaginationControl
              page={pageE}
              setPage={setPageE}
              count={countE}
              pageSize={pageSizeE}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Profile;
