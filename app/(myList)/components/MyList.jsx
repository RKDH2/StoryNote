"use client";

import Link from "next/link";
import "../components/styles/mylist.css";

export default function MyList({ result, session }) {
  return (
    <div className="my-list-container">
      {result.length > 0 ? (
        result.map((post, i) => (
          <div className="my-post-list" key={i}>
            <Link prefetch={false} href={`/detail/${post._id}`}>
              <div className="my-title-time">
                <h4 className="my-post-title">{post.title}</h4>
                <p className="my-post-time">{post.post_time}</p>
              </div>
              <p className="my-post-content">{post.content}</p>
              {post.tags && post.tags.length > 0 ? (
                <p className="my-post-tags">
                  {post.tags.split(",").map((tag, i) => (
                    <span key={i} className="my-post-tag">
                      {tag}
                    </span>
                  ))}
                </p>
              ) : null}
            </Link>
            <div className="edit-btn">
              <Link href={session ? `/edit/${post._id}` : null}>수정하기</Link>
              <button
                type="Submit"
                onClick={(e) => {
                  fetch("/api/post/delete", {
                    method: "DELETE",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({ id: post._id }),
                  }).then(() => {
                    console.log("DELETE OK");
                  });
                }}
              >
                삭제하기
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="my-no-post">
          <Link href="/write">댓글을 달아보세요!</Link>
        </div>
      )}
    </div>
  );
}
