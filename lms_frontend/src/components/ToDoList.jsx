import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function ToDoList({ courseId = null }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

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
    return <div className="card p-3 mt-3">Loading...</div>;
  }

  const now = new Date();

  const filteredItems = items.filter((item) => {
    const dueDate = item.due_date ? new Date(item.due_date) : null;

    if (activeTab === "missed") {
      return dueDate && dueDate < now;
    } else if (activeTab === "upcoming") {
      return dueDate && dueDate >= now;
    }
    return true;
  });

  return (
    <div className="card shadow-sm mt-3">
      <div className="card-body">
        <h5 className="card-title mb-3">My Tasks</h5>

        <ul className="nav nav-pills mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "missed" ? "active" : ""}`}
              onClick={() => setActiveTab("missed")}
            >
              Missed
            </button>
          </li>
        </ul>

        {filteredItems.length === 0 ? (
          <p className="text-muted">No tasks in this category.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {filteredItems.map((item) => {
              const dueDate = item.due_date ? new Date(item.due_date) : null;
              const isMissed = dueDate && dueDate < now;

              return (
                <li
                  key={`${item.type}-${item.id}`}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <Link
                    to={`/posts/${item.post_id}`}
                    className="text-decoration-none text-black flex-grow-1"
                  >
                    <div className="fw-semibold">{item.title}</div>
                    {!courseId && (
                      <div className="small text-muted">
                        {item.course_title} &bull;{" "}
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </div>
                    )}
                  </Link>
                  {dueDate && (
                    <span
                      className={`badge rounded-pill ${
                        isMissed ? "bg-danger" : "bg-primary"
                      }`}
                    >
                      {dueDate.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ToDoList;
