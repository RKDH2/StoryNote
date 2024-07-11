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
      console.log("Data", data);
    }

    fetchPosts();
  }, []);

  return (
    <>
      <div className="list-container">
        <div className="community-logo">
          <p>커뮤니티</p>
          <p>사람들과 소통하면서 지식을 넓히고 이야기를 적으세요.</p>
        </div>
        {posts.length > 0 ? (
          posts.map((post, i) => (
            <li className="post-list" key={i}>
              <div className="title-post-name_time">
                <a href={`/detail/${post._id}`} className="post-name">
                  <img
                    src={
                      post.profile_img ? post.profile_img : "/scriptparty.svg"
                    }
                    className="profile_img"
                  />
                  {post.author_name}
                </a>
                <a className="post-time">{post.post_time}</a>
              </div>
              <div className="post-title-box">
                <a href={`/detail/${post._id}`} className="post-title">
                  {post.title}
                </a>
                {/* <a href={`/detail/${post._id}`} className="post-content">
                {post.content}
              </a> */}
              </div>
              {post.tags && post.tags.length > 0 ? (
                <p className="post-tags">
                  {post.tags.split(",").map((tag, i) => (
                    <span key={i} className="post-tag">
                      #{tag}
                    </span>
                  ))}
                </p>
              ) : null}
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
