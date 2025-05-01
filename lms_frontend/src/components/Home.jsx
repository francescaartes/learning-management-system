import Header from "./Header";
import CourseCard from "./CourseCard";
import CourseCarousel from "./CourseCarousel";
import CategoryTitle from "./CategoryTitle";

function Home() {
  return (
    <>
      <div className="">
        <Header />
      </div>
      {/* <div className="vh-100">
        <CourseCarousel />
      </div> */}
      <div className="container mt-4">
        <CategoryTitle title="Latest Courses" link="#" />
        <div className="row">
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <CategoryTitle title="Featured Courses" link="#" />
        <div className="row">
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <CategoryTitle title="Popular Courses" link="#" />
        <div className="row">
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Course Title" />
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <CategoryTitle title="Featured Instructors" link="#" />
        <div className="row">
          <div className="col-md-3">
            <CourseCard cardTitle="Instructor Name" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Instructor Name" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Instructor Name" />
          </div>
          <div className="col-md-3">
            <CourseCard cardTitle="Instructor Name" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
