function Resource({ post, preview }) {
  return (
    <div
      className="resource-content"
      dangerouslySetInnerHTML={{
        __html: post.resource.content,
      }}
    />
  );
}

export default Resource;
