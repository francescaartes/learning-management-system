import TipTapEditor from "../TipTapEditor";

function ResourceForm({ data, setData }) {
  return (
    <div className="d-flex flex-column gap-2">
      <TipTapEditor
        content={data.content}
        onChange={(html) => setData({ ...data, content: html })}
      />
    </div>
  );
}

export default ResourceForm;
