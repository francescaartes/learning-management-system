import React from "react";
import { useParams } from "react-router-dom";

function CoursePage() {
  const { courseId } = useParams();

  return (
    <div className="container my-4">
      <h4>Course Page {courseId}</h4>
    </div>
  );
}

export default CoursePage;
