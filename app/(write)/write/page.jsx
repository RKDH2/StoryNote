"use client";

import { useState } from "react";
import "../components/style/write.css";
import { MdOutlineCancel } from "react-icons/md";

export default function Write(props) {
  const [tags, setTags] = useState([]);
  const [src, setSrc] = useState("");

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

  return (
    <div className="post-write">
      <p>글을 작성해 보세요!</p>
      <form className="post-form" action="/api/post/new" method="POST">
        <input
          className="title-input"
          type="text"
          name="title"
          placeholder="제목을 입력하시오"
          required
        />
        <textarea
          className="content-input"
          name="content"
          placeholder="내용을 입력하시오"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            let file = e.target.files[0];
            let filename = encodeURIComponent(file.name);
            let res = await fetch("/api/post/image?file=" + filename);
            let data = await res.json();

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
              setSrc(uploadResult.url + "/" + filename);
            } else {
              console.log("실패");
            }
          }}
        />
        {src && <img src={src} />}
        {tags.length > 0 ? (
          <div className="tags-input">
            {tags.map((tag, i) => (
              <span key={i} className="tag" onClick={() => removeTag(tag)}>
                <MdOutlineCancel /> {tag}
              </span>
            ))}
          </div>
        ) : null}
        <input
          className="text-tag"
          type="text"
          placeholder="태그입력 (Enter)"
          onKeyDown={handleKeyDown}
        />
        <input type="hidden" name="tags" value={tags.join(",")} />
        <button type="submit">생성</button>
      </form>
    </div>
  );
}
