"use client";

import { useEffect, useState } from "react";

export default function Comment(props) {
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
      <div>댓글부분입니다</div>
      {data.length > 0 ? (
        data.map((a, i) => <p key={i}>{a.comment}</p>)
      ) : (
        <p>로딩중(댓글없음)...</p>
      )}
      <input
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      {}
      <button onClick={handleSubmit}>댓글발행</button>
    </div>
  );
}
