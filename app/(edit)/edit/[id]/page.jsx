"use client";

import { useEffect, useState } from "react";
import "../../components/styles/edit.css";
import { MdOutlineCancel } from "react-icons/md";

export default function Edit(props) {
  const [tags, setTags] = useState([]);
  const [post, setPost] = useState(null);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/post/findDB?id=${props.params.id}`);
        const data = await response.json();
        console.log(data);
        setPost(data);

        if (data.tags) {
          setTags(data.tags.split(","));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/post/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.params.id,
          title: post.title,
          content: post.content,
          tags: tags.join(","),
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
    <div className="edit-post-write">
      <p>글을 수정해 보세요!</p>
      <form className="edit-post-form" onSubmit={handleSubmit}>
        <input
          className="edit-title-input"
          type="text"
          name="title"
          defaultValue={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
        />
        <textarea
          className="edit-content-input"
          name="content"
          defaultValue={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          required
        />
        {tags.length > 0 ? (
          <div className="edit-tags-input">
            {tags.map((tag, i) => (
              <span key={i} className="edit-tag" onClick={() => removeTag(tag)}>
                <MdOutlineCancel /> {tag}
              </span>
            ))}
          </div>
        ) : null}
        <input
          className="edit-text-tag"
          type="text"
          placeholder="태그입력 (Enter)"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input type="hidden" name="tags" value={tags.join(",")} />
        <button type="submit">수정</button>
      </form>
    </div>
  );
}
