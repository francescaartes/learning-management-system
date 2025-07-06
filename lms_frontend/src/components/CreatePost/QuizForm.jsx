import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TiptapEditor from "../TipTapEditor";

function QuizForm({ data, setData }) {
  const addQuestion = () => {
    setData({
      ...data,
      questions: [
        ...data.questions,
        {
          question_text: "",
          options: ["", ""],
          correct_answer: "",
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updated = [...data.questions];
    updated.splice(index, 1);
    setData({ ...data, questions: updated });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...data.questions];
    updated[index][field] = value;
    setData({ ...data, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...data.questions];
    updated[qIndex].options[oIndex] = value;
    setData({ ...data, questions: updated });
  };

  const addOption = (qIndex) => {
    const updated = [...data.questions];
    updated[qIndex].options.push("");
    setData({ ...data, questions: updated });
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...data.questions];
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options.splice(oIndex, 1);
      setData({ ...data, questions: updated });
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(data.questions);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setData({ ...data, questions: reordered });
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Instructions */}
      <div>
        <label className="form-label">Instructions</label>
        <TiptapEditor
          content={data.instructions}
          onChange={(content) => setData({ ...data, instructions: content })}
          placeholder="Write your instructions here..."
        />
      </div>

      {/* Due Date */}
      <div>
        <label className="form-label">Due Date</label>
        <input
          type="datetime-local"
          className="form-control"
          value={data.due_date}
          onChange={(e) => setData({ ...data, due_date: e.target.value })}
        />
      </div>

      {/* Time limit */}
      <div>
        <label className="form-label">Time Limit (minutes)</label>
        <input
          type="number"
          min="1"
          className="form-control"
          placeholder="e.g., 60"
          value={data.time_limit}
          onChange={(e) =>
            setData({ ...data, time_limit: parseInt(e.target.value) || 1 })
          }
        />
      </div>

      {/* Number of Attempts */}
      <div>
        <label className="form-label">Number of Attempts Allowed</label>
        <input
          type="number"
          min="1"
          className="form-control"
          placeholder="e.g., 3"
          value={data.max_attempts}
          onChange={(e) =>
            setData({ ...data, max_attempts: parseInt(e.target.value) || 1 })
          }
        />
      </div>

      {/* Questions */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {data.questions.map((q, index) => (
                <Draggable key={index} draggableId={`q-${index}`} index={index}>
                  {(provided) => (
                    <div
                      className="border p-3 rounded shadow-sm mb-3"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong {...provided.dragHandleProps}>
                          <i className="bi bi-grip-vertical me-2"></i>
                          Question {index + 1}
                        </strong>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeQuestion(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Question Text</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Question text"
                          value={q.question_text}
                          onChange={(e) =>
                            updateQuestion(
                              index,
                              "question_text",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Options</label>
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="input-group mb-1">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={`Option ${oIdx + 1}`}
                              value={opt}
                              onChange={(e) =>
                                updateOption(index, oIdx, e.target.value)
                              }
                            />
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeOption(index, oIdx)}
                              disabled={q.options.length <= 2}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mb-2"
                        onClick={() => addOption(index)}
                      >
                        <i className="bi bi-plus-circle"></i> Add Option
                      </button>
                      <div>
                        <label className="form-label">Correct Answer</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Correct Answer"
                          value={q.correct_answer}
                          onChange={(e) =>
                            updateQuestion(
                              index,
                              "correct_answer",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Question */}
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={addQuestion}
      >
        <i className="bi bi-plus-circle me-1"></i> Add Question
      </button>
    </div>
  );
}

export default QuizForm;
