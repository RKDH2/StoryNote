"use client";

import { useRef, useState } from "react";
import styles from "../components/style/write.module.css";
import { MdOutlineCancel } from "react-icons/md";

export default function Write() {
  const [tags, setTags] = useState([]);
  const [src, setSrc] = useState(""); // 이미지 업로드 보기
  const [previewSrc, setPreviewSrc] = useState(""); // 이미지 미리보기
  const [file, setFile] = useState(null); // 파일 상태
  const fileInputRef = useRef(null); // 파일 입력 필드 참조 추가

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags((prevent) => [...prevent, newTag]);
        e.target.value = "";
      }
    }
  };

  const removeTag = (tagRemove) => {
    setTags(tags.filter((tag) => tag !== tagRemove));
  };

  const handleFileChange = (e) => {
    let selectedFile = e.target.files[0];

    // 파일 미리보기 URL 생성
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreviewSrc(previewUrl);
    setFile(selectedFile); // 파일 상태 설정
  };

  const handleSubmit = async (e) => {
    if (file) {
      let filename = encodeURIComponent(file.name);
      try {
        let res = await fetch("/api/forum/image?file=" + filename);
        let data = await res.json();
        console.log("Data:", data);

        //S3 업로드
        const formData = new FormData();
        Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
          formData.append(key, value);
        });
        let uploadResult = await fetch(data.url, {
          method: "POST",
          body: formData,
        });

        console.log(uploadResult);

        if (uploadResult.ok) {
          const imageUrl = data.url + "/" + data.fields.key;
          setSrc(
            `https://scriptpartyimage.s3.ap-northeast-2.amazonaws.com/${data.imgSrc}`
          ); // 업로드된 파일의 URL 설정

          const form = e.target;
          const formDataToSend = new FormData(form);
          formDataToSend.append("imgSrc", imageUrl);
          // formDataToSend.append("content", content);

          let postImage = await fetch(form.action, {
            method: "POST",
            body: formDataToSend,
          });

          if (postImage.ok) {
            // 성공적으로 포스트를 작성한 후 원하는 동작 수행
            console.log("포스트 작성 성공");
          } else {
            console.log("포스트 작성 실패");
          }
        } else {
          console.log("업로드 실패");
        }
      } catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewSrc("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.communityContainer}>
      <div className={styles.postWrite}>
        <p>글을 작성해 보세요!</p>
        <form
          className={styles.postForm}
          action="/api/forum/new"
          method="POST"
          onSubmit={handleSubmit}
        >
          <input
            className={styles.titleInput}
            type="text"
            name="title"
            placeholder="제목을 입력하시오"
            required
          />
          <textarea
            className={styles.contentInput}
            name="content"
            placeholder="내용을 입력하시오"
          />
          <div className={styles.containerImage}>
            <label htmlFor="file">
              <div className={styles.btnUpload}>이미지 업로드하기</div>
            </label>
            <input
              id="file"
              type="file"
              accept="image/*"
              name="imgSrc"
              onChange={handleFileChange}
              ref={fileInputRef}
              className={styles.imgInputNone}
            />
            {previewSrc && (
              <>
                <img src={previewSrc} className={styles.imagePreview} />
                <button
                  className={styles.imgDeleteBtn}
                  type="button"
                  onClick={handleRemoveImage}
                >
                  이미지 삭제
                </button>
              </>
            )}
          </div>
          {tags.length > 0 && (
            <div className={styles.tagsInput}>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={styles.tag}
                  onClick={() => removeTag(tag)}
                >
                  <MdOutlineCancel /> {tag}
                </span>
              ))}
            </div>
          )}
          <input
            className={styles.textTag}
            type="text"
            placeholder="태그입력 (Enter) #은 입력하지 않아도 됨 (자동입력)"
            onKeyDown={handleKeyDown}
          />
          <input type="hidden" name="tags" value={tags.join(",")} />
          <button type="submit" className={styles.submitBtn}>
            생성
          </button>
        </form>
      </div>
    </div>
  );
}
