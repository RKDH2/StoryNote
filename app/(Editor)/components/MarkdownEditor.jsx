"use client";

import React, { useState } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownEditor({ onChange }) {
  const [markdown, setMarkdown] = useState("");

  const handleEditorChange = ({ text }) => {
    setMarkdown(text);
    onChange(text);
  };

  return (
    <MdEditor
      value={markdown}
      style={{ height: "500px" }}
      renderHTML={(text) => (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      )}
      onChange={handleEditorChange}
    />
  );
}
