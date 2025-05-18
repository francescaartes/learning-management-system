import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import TeachWithUs from "../assets/teach_with_us.png";
import api from "../api/api";

const StartTeachingPage = () => {
  const { user, fetchUser } = useUser();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    teaching_experience: "",
    video_creation_experience: "",
  });

  if (user?.is_instructor) {
    navigate("/");
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const footerStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTop: "1px solid #ddd",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 10,
  };

  const optionStyle = (selected) => ({
    border: "2px solid",
    borderColor: selected ? "#0d6efd" : "#ccc",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "12px",
    cursor: "pointer",
    backgroundColor: selected ? "#e7f1ff" : "#fff",
    fontSize: "1.1rem",
    display: "flex",
    alignItems: "center",
  });

  const handleContinue = () => {
    setShowModal(true);
  };

  const handleAgree = async () => {
    try {
      const response = await api.post("instructor_profile/", {
        teaching_experience: formData.teaching_experience,
        video_creation_experience: formData.video_creation_experience,
        agreed_to_policy: true,
      });
      setShowModal(false);
      await fetchUser();
      navigate("/dashboard");
    } catch (err) {
      console.error("Become an Instructor - error:", err);
    }
  };

  return (
    <section
      style={{ height: "100dvh", overflow: "hidden" }}
      className="bg-light"
    >
      <div className="container h-100">
        {page === 1 && (
          <div className="row h-100">
            <div className="col-md-6 d-flex align-items-center flex-column justify-content-center order-1 order-lg-0 order-md-0 mt-2">
              <div className="w-75">
                <h1 className="display-5 fw-bold">Come teach with us</h1>
                <p className="lead">
                  Become an instructor and change lives — including your own.
                </p>
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={() => (user ? setPage(2) : navigate("/login"))}
                >
                  Get started
                </button>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-center justify-content-center">
              <img
                src={TeachWithUs}
                alt="Teach with us"
                className="img-fluid"
                style={{ maxHeight: "600px", objectFit: "contain" }}
              />
            </div>
          </div>
        )}

        {page === 2 && (
          <div
            className="h-100 d-flex flex-column px-4 pt-5"
            style={{ maxWidth: "700px" }}
          >
            <h3 className="fw-bold mb-3" style={{ fontSize: "1.8rem" }}>
              Share your knowledge
            </h3>
            <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
              Tell us about your experience teaching or helping others learn.
              Whether you've guided friends, tutored classmates, or led a
              classroom — we want to know how you've shared what you know.
            </p>
            {[
              { label: "No experience", value: "none" },
              { label: "Informal (peer, tutoring)", value: "informal" },
              { label: "Online teaching", value: "online" },
              { label: "In-person teaching", value: "in_person" },
              { label: "Both online and in-person", value: "both" },
            ].map(({ label, value }) => (
              <div
                key={value}
                onClick={() => handleChange("teaching_experience", value)}
                style={optionStyle(formData.teaching_experience === value)}
              >
                <input
                  type="radio"
                  name="teaching_experience"
                  value={value}
                  checked={formData.teaching_experience === value}
                  onChange={() => handleChange("teaching_experience", value)}
                  style={{ marginRight: "10px" }}
                />
                {label}
              </div>
            ))}
            <div style={footerStyle}>
              <button
                className="btn btn-primary"
                onClick={() => setPage(3)}
                disabled={!formData.teaching_experience}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {page === 3 && (
          <div
            className="h-100 d-flex flex-column px-4 pt-5"
            style={{ maxWidth: "700px" }}
          >
            <h3 className="fw-bold mb-3" style={{ fontSize: "1.8rem" }}>
              Creating course videos
            </h3>
            <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
              Creating engaging courses means using video tools. From basic
              recordings on your phone to professional video editing — let us
              know where you’re at so we can support you better.
            </p>
            {[
              { label: "No experience", value: "none" },
              { label: "Basic (Zoom, phone camera)", value: "basic" },
              { label: "Intermediate (some editing)", value: "intermediate" },
              {
                label: "Advanced (course-quality production)",
                value: "advanced",
              },
            ].map(({ label, value }) => (
              <div
                key={value}
                onClick={() => handleChange("video_creation_experience", value)}
                style={optionStyle(
                  formData.video_creation_experience === value
                )}
              >
                <input
                  type="radio"
                  name="video_creation_experience"
                  value={value}
                  checked={formData.video_creation_experience === value}
                  onChange={() =>
                    handleChange("video_creation_experience", value)
                  }
                  style={{ marginRight: "10px" }}
                />
                {label}
              </div>
            ))}
            <div style={footerStyle}>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => setPage(2)}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleContinue}
                disabled={!formData.video_creation_experience}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h4>Terms & Conditions</h4>
            <p className="mt-3">
              Please read and agree to our Terms and Conditions and Privacy
              Policy before continuing.
            </p>
            <h6>Terms and Conditions</h6>
            <p>
              By becoming an instructor, you agree to follow our guidelines,
              avoid harmful content, and ensure your courses maintain quality
              standards.
            </p>
            <h6>Privacy Policy</h6>
            <p>
              We collect necessary data to enhance your teaching experience.
              Your data will never be sold and will only be used for platform
              functionality and support.
            </p>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAgree}>
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StartTeachingPage;
