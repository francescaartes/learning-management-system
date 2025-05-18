import React from "react";

function MediaPreviewTab({ formData, handleChange }) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          Course Thumbnail
          <div className="form-text">
            Upload a JPG/PNG image that represents your course.
          </div>
        </label>
        <input
          type="file"
          name="thumbnail"
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Preview Video URL
          <div className="form-text">
            Share a YouTube/Vimeo link introducing your course.
          </div>
        </label>
        <input
          type="url"
          name="preview_url"
          className="form-control"
          value={formData.preview_url}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default MediaPreviewTab;
