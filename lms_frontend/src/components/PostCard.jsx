import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Announcement from "./PostType/Announcement";
import Quiz from "./PostType/Quiz";
import Resource from "./PostType/Resource";
import Assignment from "./PostType/Assignment";

function PostCard({ post, isInstructor, handleEdit, handleDelete }) {
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const el = contentRef.current;
    if (el && el.scrollHeight > el.clientHeight) {
      setIsOverflowing(true);
    }
  }, []);

  const typeColors = {
    announcement: "primary",
    resource: "info",
    assignment: "warning",
    quiz: "success",
  };

  const handleCardClick = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <div
      className="card mb-3 shadow-sm position-relative"
      style={{
        maxHeight: isExpanded ? "none" : "30rem",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      <div className="d-flex justify-content-between align-items-center card-body pb-0">
        <span className={`badge bg-${typeColors[post.type] || "secondary"}`}>
          {post.type.toUpperCase()}
        </span>

        <span className="d-flex gap-3 align-items-center">
          <small className="text-muted">
            {new Date(post.created_on).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </small>
          {isInstructor && (
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn btn-outline-secondary px-1 py-0 dropdown-toggle no-caret"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-three-dots p-0 m-0"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleEdit(post.id)}
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </span>
      </div>

      <div ref={contentRef} className="card-body pt-0">
        <div className="d-flex flex-column gap-2">
          {post.type === "announcement" && <Announcement post={post} />}
          {post.type === "quiz" && <Quiz post={post} />}
          {post.type === "resource" && <Resource post={post} />}
          {post.type === "assignment" && <Assignment post={post} />}
        </div>
      </div>

      {!isExpanded && isOverflowing && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "5rem",
            background: "linear-gradient(to bottom, transparent, white)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

export default PostCard;
