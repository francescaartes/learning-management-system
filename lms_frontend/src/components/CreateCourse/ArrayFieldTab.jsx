import React from "react";

function ArrayFieldTab({
  label,
  field,
  description,
  placeholder,
  formData,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
}) {
  return (
    <div className="mb-4">
      <label className="form-label">
        {label}
        <div className="form-text mb-2">{description}</div>
      </label>
      {formData[field].map((item, index) => (
        <div className="d-flex mb-2" key={index}>
          <input
            type="text"
            className="form-control"
            placeholder={placeholder}
            value={item}
            onChange={(e) => handleArrayChange(field, index, e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-danger ms-2"
            onClick={() => removeArrayItem(field, index)}
            disabled={formData[field].length === 1}
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={() => addArrayItem(field)}
      >
        + Add Item
      </button>
    </div>
  );
}

export default ArrayFieldTab;
