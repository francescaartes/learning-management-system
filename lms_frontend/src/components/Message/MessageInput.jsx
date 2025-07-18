import React, { useState } from "react";

function MessageInput({ onSend, value, onChange }) {
  return (
    <div className="input-group mt-2">
      <input
        type="text"
        className="form-control"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
      />
      <div className="input-group-append">
        <button className="btn btn-primary" onClick={onSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
