import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function CourseLessons() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState({});

  const fetchLessons = async () => {
    try {
      const res = await api.get(`courses/${courseId}/lessons`);
      setLessons(res.data.results);
      console.log("Lessons: ", res.data.results);
    } catch (err) {
      console.log("Error fetching lessons: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLessons();
  }, []);

  return (
    <div className="container">
      <h4 className="mt-4">{lessons[0]?.course.title}</h4>
      {lessons.length > 0 ? (
        lessons.map((lesson) => <p key={lesson.id}>{lesson.title}</p>)
      ) : (
        <p>No lessons available.</p>
      )}
    </div>
  );
}

export default CourseLessons;
