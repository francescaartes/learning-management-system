import React from "react";

function Announcement({ post }) {
  return (
    <div>
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
