"use client";

import Link from "next/link";
import styles from "./styles/mylist.module.css";

export default function MyList({ result, session }) {
  return (
    <div className={styles.myListContainer}>
      {result && result.length > 0 ? (
        result.map((post, i) => (
          <div className={styles.myPostList} key={i}>
            <Link prefetch={false} href={`/detail/${post._id}`}>
              <div className={styles.myTitleTime}>
                <h4 className={styles.myPostTitle}>{post.title}</h4>
                <p className={styles.myPostTime}>{post.post_time}</p>
              </div>
              <p className={styles.myPostContent}>{post.content}</p>
              {post.tags && post.tags.length > 0 && (
                <p className={styles.myPostTags}>
                  {post.tags.split(",").map((tag, i) => (
                    <span key={i} className={styles.myPostTag}>
                      {tag}
                    </span>
                  ))}
                </p>
              )}
            </Link>
            <div className={styles.editBtn}>
              <Link href={session ? `/edit/${post._id}` : null}>수정하기</Link>
              <button
                type="button"
                onClick={() => {
                  fetch("/api/forum/delete", {
                    method: "DELETE",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({ id: post._id }),
                  }).then(() => {
                    window.location.reload();
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
        <div className={styles.myNoPost}>
          <Link href="/write">댓글을 달아보세요!</Link>
        </div>
      )}
    </div>
  );
}
