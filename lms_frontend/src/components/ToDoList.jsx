import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ToDoList({ courseId = null }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToDo = async () => {
      setLoading(true);
      try {
        let url = "todo/";
        if (courseId) {
          url += `?course=${courseId}`;
        }
        const res = await api.get(url);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching to-do list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToDo();
  }, [courseId]);

  if (loading) {
    return <div className="card p-3 mt-3">Loading To-Do List...</div>;
  }

  if (items.length === 0) {
    return <div className="card p-3 mt-3 text-muted">No upcoming tasks.</div>;
  }

  return (
    <div className="card p-3 mt-3 shadow-sm">
      <h5 className="mb-3">Upcoming Tasks</h5>
      <ul className="list-group list-group-flush">
        {items.map((item) => (
          <li
            key={`${item.type}-${item.id}`}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <button
              className="btn text-start text-decoration-none text-black"
              onClick={() => navigate(`/posts/${item.post_id}`)}
              style={{ flex: 1 }}
            >
              <div className="fw-semibold">{item.title}</div>
              {!courseId && (
                <div className="small text-muted">
                  {item.course_title} &bull;{" "}
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>
              )}
            </button>
            {item.due_date && (
              <span
                className={`badge rounded-pill ${
                  new Date(item.due_date) < new Date()
                    ? "bg-danger"
                    : "bg-primary"
                }`}
              >
                {new Date(item.due_date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;
