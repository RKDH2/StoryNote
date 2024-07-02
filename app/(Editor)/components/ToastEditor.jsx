import React, { useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const ToastEditor = ({ value, onChange }) => {
  const editorRef = useRef();

  const handleChange = () => {
    const editorInstance = editorRef.current.getInstance();
    onChange(editorInstance.getMarkdown());
  };

  return (
    <Editor
      ref={editorRef}
      initialValue={value}
      previewStyle="vertical"
      height="400px"
      initialEditType="markdown"
      useCommandShortcut={true}
      onChange={handleChange}
    />
  );
};

export default ToastEditor;
