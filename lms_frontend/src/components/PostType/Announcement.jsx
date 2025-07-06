import React from "react";

function Announcement({ post }) {
  return (
    <div className="d-flex flex-column gap-2">
      <h5 className="mt-2 mb-0">{post.title}</h5>
      <p
        className="html-content"
        dangerouslySetInnerHTML={{
          __html: post.announcement.message,
        }}
      />
    </div>
  );
}

export default Announcement;
