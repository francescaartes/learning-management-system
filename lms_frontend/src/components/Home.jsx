import CourseCard from "./CourseCard";
import CourseCarousel from "./CourseCarousel";
import CategoryTitle from "./CategoryTitle";

function Home() {
  return (
    <>
      <div className="container mt-4">
        <CategoryTitle title="Latest Courses" link="#" />
        <div className="row">
          <div className="col-md-3">
            <CourseCard
              courseTitle="React for Beginners"
              img="react.svg"
              courseId="1"
            />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <CategoryTitle title="Featured Courses" link="#" />
        <div className="row">
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <CategoryTitle title="Popular Courses" link="#" />
        <div className="row">
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Course Title" img="react.svg" />
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <CategoryTitle title="Featured Instructors" link="#" />
        <div className="row">
          <div className="col-md-3">
            <CourseCard courseTitle="Instructor Name" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Instructor Name" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Instructor Name" img="react.svg" />
          </div>
          <div className="col-md-3">
            <CourseCard courseTitle="Instructor Name" img="react.svg" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
