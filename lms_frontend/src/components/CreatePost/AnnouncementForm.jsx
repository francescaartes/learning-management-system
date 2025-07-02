import React from "react";
import TiptapEditor from "../TipTapEditor";

function AnnouncementForm({ data, setData }) {
  return (
    <div className="" style={{ minHeight: "10rem" }}>
      <TiptapEditor
        content={data.message}
        onChange={(content) => setData({ ...data, message: content })}
        placeholder="Write your announcement message here..."
      />
    </div>
  );
}

export default AnnouncementForm;
