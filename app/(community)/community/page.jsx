import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import PostList from "../components/PostList";
import styles from "../components/styles/community.module.css";

export const dynamic = "force-dynamic";

export default async function Community() {
  const db = (await connectDB).db("forum");
  let result = await db
    .collection("community_post")
    .find()
    .sort({ post_time: -1 })
    .toArray();

  result = result.map((a) => {
    a._id = a._id.toString();
    return a;
  });

  result = result.map((post) => {
    // post_time 필드가 Date 객체가 아니면 변환
    const postTime =
      post.post_time instanceof Date
        ? post.post_time
        : new Date(post.post_time);

    return {
      ...post,
      _id: post._id.toString(),
      post_id: post.post_id.toString(),
      post_time: postTime.toISOString(),
    };
  });

  let session = await getServerSession(authOptions);

  return (
    <div className={styles.list_background}>
      <PostList result={result} session={session} />
    </div>
  );
}
