import "../components/style/write.css";

export default function Write() {
  return (
    <div className="post-write">
      <p>글을 작성해 보세요!</p>
      <form className="post-form" action="/api/post/new" method="POST">
        <input type="text" name="title" placeholder="글제목" required />
        <textarea name="content" placeholder="글내용" required />
        <button type="submit">생성</button>
      </form>
    </div>
  );
}
