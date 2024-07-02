import React, { useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import styles from "./styles/ToastEditor.module.css";
import axios from "axios";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(
      "https://scriptpartyimage.s3.ap-northeast-2.amazonaws.com/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 이미지 업로드 후의 응답에서 이미지 URL을 추출하여 반환
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Failed to upload image");
  }
};

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
      className={styles.toastEditor}
      hooks={{
        addImageBlobHook: async (file) => {
          const imageUrl = await uploadImage(file);
          return imageUrl;
        },
      }}
    />
  );
};

export default ToastEditor;
