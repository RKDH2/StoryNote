import Link from "next/link";
import "../components/styles/list.css";

export default function PostList({ result, session }) {
  // console.log(result);
  return (
    <div className="list-container">
      {result.length > 0 ? (
        result.map((post, i) => (
          <div className="post-list" key={i}>
            <Link prefetch={false} href={`/detail/${post._id}`}>
              <div className="title-time">
                <h4 className="post-title">{post.title}</h4>
                <p className="post-time">{post.post_time}</p>
              </div>
              <p className="post-content">{post.content}</p>
              {post.tags && post.tags.length > 0 ? (
                <p className="post-tags">
                  {post.tags.split(",").map((tag, i) => (
                    <span key={i} className="post-tag">
                      {tag}
                    </span>
                  ))}
                </p>
              ) : null}
            </Link>
          </div>
        ))
      ) : (
        <div className="no-post">
          <Link href="/write">최초로 댓글을 달아보세요!</Link>
        </div>
      )}
    </div>
  );
}
