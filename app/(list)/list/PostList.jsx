import Link from "next/link";
import "../components/styles/list.css";

export default function PostList({ result, session }) {
  return (
    <div>
      {result.length > 0 ? (
        result.map((post, i) => (
          <div className="post-list" key={i}>
            <Link prefetch={false} href={`/detail/${post._id}`}>
              <h4>{post.title}</h4>
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
