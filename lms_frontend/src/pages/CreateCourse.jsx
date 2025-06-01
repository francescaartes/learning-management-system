import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseDetailsTab from "../components/CreateCourse/CourseDetailsTab";
import MediaPreviewTab from "../components/CreateCourse/MediaPreviewTab";
import ArrayFieldTab from "../components/CreateCourse/ArrayFieldTab";
import api from "../api/api";

function CreateCourse() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "",
    category: "",
    thumbnail: null,
    preview_url: "",
    learn: [""],
    topics: [""],
    inclusion: [""],
    requirements: [""],
    is_published: false,
  });

  const [categories, setCategories] = useState([]);
  const [courseId, setCourseId] = useState(null);

  const sections = [
    "Course Details",
    "Media & Preview",
    "Learning Outcomes",
    "Detailed Topics",
    "Included Materials",
    "Prerequisites",
  ];

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) =>
    setFormData({ ...formData, [field]: [...formData[field], ""] });

  const removeArrayItem = (field, index) =>
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });

  const fetchCategories = async () => {
    try {
      const catRes = await api.get("categories/");
      setCategories(catRes.data);
    } catch (err) {
      console.log("Fetching categories error", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveDraft = async () => {
    if (!formData.title.trim()) return;

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("language", formData.language);
    form.append("preview_url", formData.preview_url);
    form.append("is_published", false);
    form.append("category", formData.category);

    if (formData.thumbnail) {
      form.append("thumbnail", formData.thumbnail);
    }

    ["learn", "topics", "inclusion", "requirements"].forEach((field) => {
      if (formData[field] && Array.isArray(formData[field])) {
        form.append(field, JSON.stringify(formData[field]));
      }
    });

    try {
      if (courseId == null) {
        const createRes = await api.post("create_course/", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCourseId(createRes.data.id);
        console.log("Draft saved:", createRes.data);
      } else {
        const updateRes = await api.put(`courses/${courseId}/`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Draft updated:", updateRes.data);
      }
    } catch (err) {
      console.error("Draft save error:", err);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <CourseDetailsTab
            categories={categories}
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 1:
        return (
          <MediaPreviewTab formData={formData} handleChange={handleChange} />
        );
      case 2:
        return (
          <ArrayFieldTab
            label="What Will Students Learn?"
            field="learn"
            description="Highlight the key skills or knowledge your students will gain from this course."
            placeholder="e.g., Build a full-stack app"
            formData={formData}
            handleArrayChange={handleArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        );
      case 3:
        return (
          <ArrayFieldTab
            label="Topics Covered in This Course"
            field="topics"
            description="Break down your course into major topics or modules."
            placeholder="e.g., Introduction to Python"
            formData={formData}
            handleArrayChange={handleArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        );
      case 4:
        return (
          <ArrayFieldTab
            label="Course Materials Included"
            field="inclusion"
            description="List resources that students will have access to."
            placeholder="e.g., 40+ hours of video"
            formData={formData}
            handleArrayChange={handleArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        );
      case 5:
        return (
          <ArrayFieldTab
            label="Course Requirements or Prerequisites"
            field="requirements"
            description="Mention any skills or tools students should have before starting."
            placeholder="e.g., Familiarity with HTML"
            formData={formData}
            handleArrayChange={handleArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        );
      default:
        return null;
    }
  };

  const isFormComplete = () => {
    const requiredFields = [
      "title",
      "description",
      "language",
      "category",
      "thumbnail",
      "preview_url",
      "learn",
      "topics",
      "inclusion",
      "requirements",
    ];

    for (let field of requiredFields) {
      const value = formData[field];

      if (Array.isArray(value)) {
        if (value.length === 0 || value.some((item) => item.trim() === "")) {
          return false;
        }
      } else if (!value || value === "") {
        return false;
      }
    }

    return true;
  };

  const handleTabSwitch = async (index) => {
    await saveDraft();
    setActiveTab(index);
  };

  const handleContinue = async () => {
    if (!isFormComplete()) {
      alert("Please complete all fields before continuing to lessons.");
      return;
    }

    await saveDraft();

    if (courseId) {
      navigate(`/create_lessons/${courseId}`);
    } else {
      alert("Error: Course ID missing. Try saving the form again.");
    }
  };

  return (
    <div className="container my-4">
      <h4 className="mb-3">Start a New Course</h4>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card p-3">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className={`mb-2 cursor-pointer ${
                  activeTab === idx ? "fw-bold text-primary" : ""
                }`}
                onClick={() => handleTabSwitch(idx)}
                style={{ cursor: "pointer" }}
              >
                {section}
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-9">
          <div className="card p-4">{renderTabContent()}</div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            {activeTab > 0 && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => handleTabSwitch(activeTab - 1)}
              >
                Back
              </button>
            )}

            {activeTab < sections.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => handleTabSwitch(activeTab + 1)}
              >
                Next
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleContinue}>
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
