"use client";

import Link from "next/link";
import styles from "./styles/mylist.module.css";

export default function MyList({ result, session }) {
  return (
    <div className={styles.myListContainer}>
      {result && result.length > 0 ? (
        result.map((post, i) => (
          <div className={styles.myPostList} key={i}>
            {post.imgSrc ? (
              <a
                className={styles.my_post_img_container}
                href={`/detail/${post._id}`}
              >
                {post.imgSrc && (
                  <div
                    className={styles.my_post_img}
                    style={{
                      backgroundImage: `url(/api/forum/proxy-image?url=${encodeURIComponent(
                        post.imgSrc
                      )})`,
                    }}
                  ></div>
                )}
              </a>
            ) : null}
            <div className={styles.my_title_post_name}>
              <a href={`/detail/${post._id}`} className={styles.my_post_name}>
                <img
                  src={post.profile_img ? post.profile_img : "/noprofile.svg"}
                  className={styles.my_profile_img}
                />
                {post.author_name}
              </a>
            </div>
            <div className={styles.my_post_title_box}>
              <a className={styles.my_post_title} href={`/detail/${post._id}`}>
                {post.title}
              </a>
              <a
                className={styles.my_post_content}
                href={`/detail/${post._id}`}
              >
                {post.content}
              </a>
            </div>
            <div className={styles.my_post_footer}>
              {post.tags && post.tags.length > 0 ? (
                <p className={styles.my_post_tags}>
                  {post.tags.split(",").map((tag, i) => (
                    <span key={i} className={styles.my_post_tag}>
                      #{tag}
                    </span>
                  ))}
                </p>
              ) : null}
              <a className={styles.my_post_time}>{post.post_time}</a>
            </div>
            <div className={styles.my_editBtn}>
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
        <div className={styles.my_myNoPost}>
          <Link href="/write">글을 작성해보세요!</Link>
        </div>
      )}
    </div>
  );
}
