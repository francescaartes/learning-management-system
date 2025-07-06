function Resource({ post, preview }) {
  return (
    <div className="d-flex flex-column gap-2">
      <h5 className="mt-2 mb-0">{post.title}</h5>
      <div
        className="resource-content"
        dangerouslySetInnerHTML={{
          __html: post.resource.content,
        }}
      />
    </div>
  );
}

export default Resource;
