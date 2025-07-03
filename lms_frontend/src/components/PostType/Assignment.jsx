import React from "react";

function Assignment({ post }) {
  return (
    <div className="d-flex flex-column gap-4">
      <p
        className="html-content"
        dangerouslySetInnerHTML={{
          __html: post.assignment.instructions,
        }}
      />
    </div>
  );
}

export default Assignment;
