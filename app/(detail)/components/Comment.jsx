"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Comment.module.css";

export default function Comment(props, { session }) {
  let [comment, setComment] = useState("");
  let [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/comment/list?id=" + props._id)
      .then((r) => r.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [props._id]);

  const handleSubmit = () => {
    fetch("/api/comment/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: comment, _id: props._id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        setData([...data, result]);
        setComment("");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  return (
    <div>
      <hr />
      <div className={styles.comment_container}>
        <div className={styles.comment_title}>댓글</div>
        {data.length > 0 ? (
          data.map((a, i) => (
            <div className={styles.comment_text} key={i}>
              <p className={styles.user_name}>{a.author_name}</p>
              <p>{a.comment}</p>
            </div>
          ))
        ) : (
          <p className={styles.comment_text}>로딩중(댓글없음)...</p>
        )}
        <div className={styles.comment_input_container}>
          <input
            className={styles.comment_input}
            placeholder="댓글을 작성해보세요!"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            required
          />
          <button onClick={handleSubmit}>댓글발행</button>
        </div>
      </div>
    </div>
  );
}
