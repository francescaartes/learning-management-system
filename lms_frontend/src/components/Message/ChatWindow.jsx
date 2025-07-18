import React, { useEffect, useRef } from "react";

function ChatWindow({ messages, currentUserId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="p-3 border rounded bg-white"
      style={{ height: "400px", overflowY: "scroll" }}
    >
      {messages.map((msg, index) => {
        const isUser = msg.sender === currentUserId;
        return (
          <div
            key={msg.id ?? `${msg.sender}-${msg.timestamp}-${index}`}
            className={`d-flex mb-2 ${
              isUser ? "justify-content-end" : "justify-content-start"
            }`}
          >
            {!isUser && msg.sender_profile_img && (
              <img
                src={msg.sender_profile_img}
                alt="avatar"
                className="rounded-circle me-2"
                style={{ width: "32px", height: "32px" }}
              />
            )}
            <div
              className={`p-2 rounded ${
                isUser ? "bg-primary text-white" : "bg-light"
              }`}
              style={{ maxWidth: "70%" }}
            >
              {!isUser && <strong>{msg.sender_username}</strong>}
              <div>{msg.content}</div>
              <small
                className="text-muted d-block mt-1"
                style={{ fontSize: "0.75rem" }}
              >
                {new Date(msg.timestamp).toLocaleString("en-US", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </small>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatWindow;
