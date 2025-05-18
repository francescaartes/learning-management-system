import React from "react";
import Select from "react-select";

function CourseDetailsTab({ formData, handleChange, categories }) {
  return (
    <>
      {[
        {
          label: "Course Title",
          name: "title",
          type: "text",
          helper:
            "Provide a clear, compelling title. e.g., 'Mastering React for Beginners'",
        },
        {
          label: "Course Description",
          name: "description",
          type: "textarea",
          helper: "Summarize what the course covers and its benefits.",
        },
        {
          label: "Language of Instruction",
          name: "language",
          type: "text",
          helper: "Specify the language. e.g., English, Spanish",
        },
      ].map(({ label, name, type, helper }) => (
        <div className="mb-3" key={name}>
          <label className="form-label">
            {label}
            <div className="form-text">{helper}</div>
          </label>
          {type === "textarea" ? (
            <textarea
              name={name}
              className="form-control"
              rows="4"
              value={formData[name]}
              onChange={handleChange}
            />
          ) : (
            <input
              type={type}
              name={name}
              className="form-control"
              value={formData[name]}
              onChange={handleChange}
            />
          )}
        </div>
      ))}

      <div className="mb-3">
        <label className="form-label">
          Course Category
          <div className="form-text">
            Choose a relevant category. e.g., Web Development, Marketing
          </div>
        </label>
        <Select
          name="category"
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          value={
            formData.category
              ? categories
                  .map((cat) => ({ value: cat.id, label: cat.name }))
                  .find((opt) => opt.value === formData.category)
              : null
          }
          onChange={(selectedOption) =>
            handleChange({
              target: {
                name: "category",
                value: selectedOption ? selectedOption.value : "",
              },
            })
          }
          placeholder="Select or type a category"
          isClearable
        />
      </div>
    </>
  );
}

export default CourseDetailsTab;
