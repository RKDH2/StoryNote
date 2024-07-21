"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../../components/styles/edit.module.css";
import { MdOutlineCancel } from "react-icons/md";
import { getSession } from "next-auth/react";

export default function Edit(props) {
  const [tags, setTags] = useState([]);
  const [post, setPost] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [previewSrc, setPreviewSrc] = useState(""); // 이미지 미리보기
  const [file, setFile] = useState(null); // 파일 상태
  const fileInputRef = useRef(null); // 파일 입력 필드 참조 추가

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/forum/findDB?id=${props.params.id}`);
        const data = await response.json();
        setPost(data);
        // console.log("Data", data);

        if (data.tags) {
          setTags(data.tags.split(","));
        }

        if (data.imgSrc) {
          // console.log("url:", data.imgSrc);
          const IMGSRC = data.imgSrc.startsWith("https://")
            ? data.imgSrc
            : `https://scriptpartyimage.s3.ap-northeast-2.amazonaws.com/${data.imgSrc}`;
          setPreviewSrc(IMGSRC);
          // 파일 입력 필드에 파일을 설정합니다.
          const fakeFile = new File([""], data.imgSrc, { type: "image/*" });
          setFile(fakeFile);
        }
      } catch (error) {
        console.log("Error", error);
      }
    }
    fetchPost();
  }, [props.params.id]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimTag = newTag.trim();
      if (trimTag && !tags.includes(trimTag)) {
        setTags([...tags, trimTag]);
        setNewTag("");
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
    console.log("Preview URL:", previewUrl);
    setPreviewSrc(previewUrl);
    setFile(selectedFile); // 파일 상태 설정
  };

  const handleRemoveImage = () => {
    setPreviewSrc("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imgUrl = previewSrc; // 초기값으로 previewSrc를 설정합니다.
    if (file && file.name !== post.imgSrc) {
      let filename = encodeURIComponent(file.name);
      try {
        let res = await fetch("/api/forum/image?file=" + filename);
        let data = await res.json();
        console.log(data);

        // S3 업로드
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
          imgUrl = `https://scriptpartyimage.s3.ap-northeast-2.amazonaws.com/${data.fields.key}`;
          setPreviewSrc(imgUrl); // 업로드된 파일의 URL 설정
        } else {
          console.log("업로드 실패");
        }
      } catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
      }
    }

    try {
      const session = await getSession();
      if (!session) {
        throw new Error("No session found");
      }

      const response = await fetch("/api/forum/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          id: props.params.id,
          title: post.title,
          content: post.content,
          tags: tags.join(","),
          imgSrc: imgUrl,
          post_time: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        console.log("Post updated successfully!");
        window.location.href = "/mylist";
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post", error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.editPostWrite}>
      <p>글을 수정해 보세요!</p>
      <form className={styles.editPostForm} onSubmit={handleSubmit}>
        <input
          className={styles.editTitleInput}
          type="text"
          name="title"
          defaultValue={post.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          required
        />
        <textarea
          className={styles.editContentInput}
          name="content"
          defaultValue={post.content}
          onChange={(e) =>
            setPostData({ ...postData, content: e.target.value })
          }
          required
        />
        <div className={styles.editContainerImage}>
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
              <img
                src={previewSrc}
                className={styles.editImagePreview}
                alt="Preview"
              />
              <button
                className={styles.editImgDeleteBtn}
                type="button"
                onClick={handleRemoveImage}
              >
                이미지 삭제
              </button>
            </>
          )}
        </div>
        {tags.length > 0 && (
          <div className={styles.editTagsInput}>
            {tags.map((tag, i) => (
              <span
                key={i}
                className={styles.editTag}
                onClick={() => removeTag(tag)}
              >
                <MdOutlineCancel /> {tag}
              </span>
            ))}
          </div>
        )}
        <input
          className={styles.editTextTag}
          type="text"
          placeholder="태그입력 (Enter)"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input type="hidden" name="tags" value={tags.join(",")} />
        <button type="submit" className={styles.submitBtn}>
          수정
        </button>
      </form>
    </div>
  );
}
