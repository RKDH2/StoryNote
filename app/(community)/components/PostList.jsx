"use client";

import Link from "next/link";
import "./styles/community.css";
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
      <div className="list-container">
        {posts.length > 0 ? (
          posts.map((post, i) => (
            <li className="post-list" key={i}>
              {post.imgSrc ? (
                <a className="post-img-container" href={`/detail/${post._id}`}>
                  {post.imgSrc && (
                    <div
                      className="post-img"
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
              <div className="title-post-name">
                <a href={`/detail/${post._id}`} className="post-name">
                  <img
                    src={post.profile_img ? post.profile_img : "/noprofile.svg"}
                    className="profile_img"
                  />
                  {post.author_name}
                </a>
              </div>
              <div className="post-title-box">
                <a className="post-title" href={`/detail/${post._id}`}>
                  {post.title}
                </a>
                <a className="post-content" href={`/detail/${post._id}`}>
                  {post.content}
                </a>
              </div>
              <div className="post-footer">
                {post.tags && post.tags.length > 0 ? (
                  <p className="post-tags">
                    {post.tags.split(",").map((tag, i) => (
                      <span key={i} className="post-tag">
                        #{tag}
                      </span>
                    ))}
                  </p>
                ) : null}
                <a className="post-time">{post.post_time}</a>
              </div>
            </li>
          ))
        ) : (
          <div className="no-post">
            <Link href="/write">최초로 댓글을 달아보세요!</Link>
          </div>
        )}
      </div>
    </>
  );
}
