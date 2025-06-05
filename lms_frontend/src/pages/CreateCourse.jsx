import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseDetailsTab from "../components/CreateCourse/CourseDetailsTab";
import MediaPreviewTab from "../components/CreateCourse/MediaPreviewTab";
import ArrayFieldTab from "../components/CreateCourse/ArrayFieldTab";
import api from "../api/api";

function CreateCourse() {
  const { courseId: paramCourseId } = useParams();
  const navigate = useNavigate();

  const sections = [
    "Course Details",
    "Media & Preview",
    "Learning Outcomes",
    "Detailed Topics",
    "Included Materials",
    "Prerequisites",
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [courseId, setCourseId] = useState(paramCourseId || null);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

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

  const fetchCategories = async () => {
    try {
      const catRes = await api.get("categories/");
      setCategories(catRes.data);
    } catch (err) {
      console.log("Fetching categories error", err);
    }
  };

  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      const res = await api.get(`courses/${courseId}/`);
      const data = res.data;

      setFormData({
        title: data.title || "",
        description: data.description || "",
        language: data.language || "",
        category: data.category || "",
        thumbnail: null,
        preview_url: data.preview_url || "",
        learn: data.learn.length ? data.learn : [""],
        topics: data.topics.length ? data.topics : [""],
        inclusion: data.inclusion.length ? data.inclusion : [""],
        requirements: data.requirements.length ? data.requirements : [""],
        is_published: data.is_published || false,
      });

      setThumbnailPreview(data.thumbnail || null);
    } catch (error) {
      console.error("Failed to fetch course for editing:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setThumbnailPreview(previewUrl);
      } else {
        setThumbnailPreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  const saveDraft = async () => {
    if (!formData.title.trim()) return;

    const form = new FormData();
    form.append("title", formData.title);
    if (formData.description) form.append("description", formData.description);
    if (formData.language) form.append("language", formData.language);
    if (formData.preview_url) form.append("preview_url", formData.preview_url);
    if (formData.category) form.append("category", formData.category);
    form.append("is_published", false);

    if (formData.thumbnail) {
      form.append("thumbnail", formData.thumbnail);
    }

    ["learn", "topics", "inclusion", "requirements"].forEach((field) => {
      if (formData[field] && Array.isArray(formData[field])) {
        const clean = formData[field].filter((item) => item.trim() !== "");
        form.append(field, JSON.stringify(clean));
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
        const updateRes = await api.patch(`courses/${courseId}/`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Draft updated:", updateRes.data);
      }
    } catch (err) {
      console.error("Draft save error:", err.response?.data || err);
    }
  };

  const publishCourse = async () => {
    if (!isFormComplete()) {
      alert("Please complete all fields before publishing.");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("language", formData.language);
    form.append("preview_url", formData.preview_url);
    form.append("is_published", true);
    form.append("category", formData.category);

    if (formData.thumbnail) {
      form.append("thumbnail", formData.thumbnail);
    }

    ["learn", "topics", "inclusion", "requirements"].forEach((field) => {
      form.append(
        field,
        JSON.stringify(formData[field].filter((item) => item.trim() !== ""))
      );
    });

    try {
      if (courseId == null) {
        const res = await api.post("create_course/", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCourseId(res.data.id);
        alert("Course published successfully!");
      } else {
        const res = await api.patch(`courses/${courseId}/`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Course updated and published!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Publishing error:", err.response?.data || err);
      alert("There was an error publishing the course.");
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
            thumbnailPreview={thumbnailPreview}
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
      "learn",
      "topics",
      "inclusion",
      "requirements",
    ];

    if (!thumbnailPreview && !formData.thumbnail) return false;

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

  return (
    <div className="container my-4">
      <h4 className="mb-3">
        {courseId ? "Edit Course" : "Start a New Course"}
      </h4>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card p-3">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className={`mb-2 ${
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
              <>
                <button
                  className="btn btn-outline-primary"
                  onClick={async () => {
                    await saveDraft();
                    navigate("/dashboard");
                  }}
                >
                  Save as Draft
                </button>
                <button
                  className="btn btn-primary"
                  onClick={publishCourse}
                  disabled={!isFormComplete()}
                >
                  Publish
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
