import TipTapEditor from "../TipTapEditor";

function ResourceForm({ data, setData }) {
  return (
    <div className="d-flex flex-column gap-2">
      <TipTapEditor
        content={data.description}
        onChange={(html) => setData({ ...data, description: html })}
      />
    </div>
  );
}

export default ResourceForm;
