import React from "react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";

function AnnouncementForm({ data, setData }) {
  return (
    <div className="" style={{ minHeight: "10rem" }}>
      <ReactQuill
        theme="snow"
        value={data.message}
        onChange={(content) => setData({ ...data, message: content })}
        placeholder="Write your announcement message here..."
      />
    </div>
  );
}

export default AnnouncementForm;
