import React from "react";
import { useParams } from "react-router-dom";

function CourseDetail({
  title = "React for Beginners",
  description = "A complete guide to building dynamic web apps with React.",
  instructor = "Jane Doe",
  rating = 4.7,
  totalStudents = 1243,
  lastUpdated = "March 2025",
  language = "English",
  whatYouWillLearn = [
    "Build modern web apps",
    "Understand component-based architecture",
    "State and props management",
  ],
  topics = ["React", "JavaScript", "Hooks", "SPA", "JSX"],
  includes = [
    "10 hours of video",
    "5 downloadable resources",
    "Certificate of completion",
  ],
  requirements = ["Basic HTML/CSS", "Some JavaScript knowledge"],
  previewUrl = "https://www.w3schools.com/html/mov_bbb.mp4",
  onEnroll = {},
}) {
  const { courseId } = useParams();

  return (
    <div className="container my-5">
      <div className="row">
        {/* Left Section */}
        <div className="col-lg-8">
          <h2>
            {title} ({courseId})
          </h2>
          <p className="text-muted">By {instructor}</p>
          <p>{description}</p>

          <ul className="list-inline text-muted">
            <li className="list-inline-item">Rating: {rating}⭐</li>
            <li className="list-inline-item">• {totalStudents} students</li>
            <li className="list-inline-item">• Last updated: {lastUpdated}</li>
            <li className="list-inline-item">• Language: {language}</li>
          </ul>

          <hr />

          <h5>What you'll learn</h5>
          <ul>
            {whatYouWillLearn.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h5>Topics covered</h5>
          <div className="d-flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span key={index} className="badge bg-secondary">
                {topic}
              </span>
            ))}
          </div>

          <h5 className="mt-4">Requirements</h5>
          <ul>
            {requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>

          <h5 className="mt-4">Course Includes</h5>
          <ul>
            {includes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-4">
          <div className="card mb-3">
            <video controls width="100%">
              <source src={previewUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="card-body">
              <button className="btn btn-primary w-100" onClick={onEnroll}>
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
