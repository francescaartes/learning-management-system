import React, { useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import "./TiptapEditor.css";

export default function TiptapEditor({ content, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Type something...",
        emptyEditorClass: "is-editor-empty",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    content: "" || content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose mx-auto min-h-[300px] p-4 border rounded bg-white focus:outline-none",
      },
    },
  });

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const setImage = useCallback(() => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-container">
      <div className="tiptap-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          title="Bold"
        >
          <i className="bi bi-type-bold"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          title="Italic"
        >
          <i className="bi bi-type-italic"></i>
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
          title="Heading 1"
        >
          <i className="bi bi-type-h1"></i>
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
          title="Heading 2"
        >
          <i className="bi bi-type-h2"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          title="Bullet List"
        >
          <i className="bi bi-list-ul"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          title="Numbered List"
        >
          <i className="bi bi-list-ol"></i>
        </button>
        <button onClick={setLink} title="Add Link">
          <i className="bi bi-link-45deg"></i>
        </button>
        <button onClick={setImage} title="Add Image">
          <i className="bi bi-image"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("codeBlock") ? "active" : ""
          }`}
          title="Code Block"
        >
          <i className="bi bi-code-slash"></i>
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
