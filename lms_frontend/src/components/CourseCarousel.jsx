import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CategoryTitle from "./CategoryTitle";
import CourseCard from "./CourseCard";

function CourseCarousel({ courses }) {
  return (
    <>
      <section className="container">
        <div className="row">
          {courses.length > 0 ? (
            <Carousel
              responsive={{
                superLargeDesktop: {
                  breakpoint: { max: 4000, min: 1280 },
                  items: 5,
                },
                desktop: {
                  breakpoint: { max: 1280, min: 1024 },
                  items: 4,
                },
                tablet: {
                  breakpoint: { max: 1024, min: 768 },
                  items: 3,
                },
                mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
              }}
              infinite={false}
              arrows={true}
              containerClass="carousel-container"
              itemClass="pe-3"
            >
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </Carousel>
          ) : (
            <p>No courses available at the moment.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default CourseCarousel;
