"use client";

import Link from "next/link";
import styles from "./styles/community.module.css";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function PostList({ result, session }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("/api/forum/postFind", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPosts(data);
      // console.log(data);
    }

    fetchPosts();
  }, []);

  const AWS_S3_SRC = process.env.NEXT_PUBLIC_AWS_S3_SRC;

  return (
    <>
      <div className={styles.list_container}>
        {posts.length > 0 ? (
          posts.map((post, i) => (
            <li className={styles.post_list} key={i}>
              {post.imgSrc ? (
                <a
                  className={styles.post_img_container}
                  href={`/detail/${post._id}`}
                >
                  {post.imgSrc && (
                    <div
                      className={styles.post_img}
                      style={{
                        backgroundImage: `url(${
                          post.imgSrc.startsWith("https://")
                            ? post.imgSrc
                            : `${AWS_S3_SRC}${post.imgSrc}`
                        })`,
                      }}
                    ></div>
                  )}
                </a>
              ) : null}
              <div className={styles.title_post_name}>
                <a href={`/detail/${post._id}`} className={styles.post_name}>
                  <img
                    src={post.profile_img ? post.profile_img : "/noprofile.svg"}
                    className={styles.profile_img}
                  />
                  {post.author_name}
                </a>
              </div>
              <div className={styles.post_title_box}>
                <a className={styles.post_title} href={`/detail/${post._id}`}>
                  {post.title}
                </a>
                <a className={styles.post_content} href={`/detail/${post._id}`}>
                  {post.content}
                </a>
              </div>
              <div className={styles.post_footer}>
                {post.tags && post.tags.length > 0 ? (
                  <p className={styles.post_tags}>
                    {post.tags.split(",").map((tag, i) => (
                      <span key={i} className={styles.post_tag}>
                        #{tag}
                      </span>
                    ))}
                  </p>
                ) : null}
                <a className={styles.post_time}>{post.post_time}</a>
              </div>
            </li>
          ))
        ) : (
          <div className={styles.no_post}>
            <Link href="/write">최초로 댓글을 달아보세요!</Link>
          </div>
        )}
      </div>
    </>
  );
}
