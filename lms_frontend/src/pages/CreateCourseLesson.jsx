import React from "react";
import { useParams } from "react-router-dom";

function CreateCourseLesson() {
  const { courseId } = useParams();
  return <div>CreateCourseLesson {courseId}</div>;
}

export default CreateCourseLesson;
