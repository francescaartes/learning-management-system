import React from "react";

const Modal = ({
  show,
  onClose,
  title,
  body,
  confirmText,
  confirmClass = "btn-primary",
  onConfirm,
  size = "md",
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className={`modal-dialog ${
          size === "lg" ? "modal-lg" : size === "xl" ? "modal-xl" : ""
        }`}
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5
              className={`modal-title ${
                confirmClass === "btn-warning" ? "text-warning" : ""
              }`}
            >
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">{body}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            {onConfirm && (
              <button
                type="button"
                className={`btn ${confirmClass}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
