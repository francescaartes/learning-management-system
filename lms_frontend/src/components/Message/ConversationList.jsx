import React from "react";

function ConversationList({ conversations, selected, onSelect }) {
  return (
    <div className="list-group">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          className={`list-group-item list-group-item-action ${
            selected === conv.id ? "active" : ""
          }`}
          onClick={() => onSelect(conv.id)}
        >
          {conv.title}
          {conv.unreadCount > 0 && (
            <span className="badge badge-danger badge-pill float-right">
              {conv.unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default ConversationList;
