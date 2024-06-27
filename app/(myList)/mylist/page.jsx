import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import MyList from "../components/MyList";

export const dynamic = "force-dynamic";

export default async function MyPostList() {
  const db = (await connectDB).db("forum");

  let session = await getServerSession(authOptions);

  const email = session.user.email;

  const testdb = (await connectDB).db("test");
  const users = await testdb.collection("users").findOne({ email: email });
  const userId = users._id.toString();

  // console.log(session);
  // console.log(userId);

  let result = await db
    .collection("community_post")
    .find({ post_id: userId })
    .sort({ post_time: -1 })
    .toArray();

  result = result.map((a) => {
    a._id = a._id.toString();
    return a;
  });

  // console.log(result);

  return (
    <div className="list-background">
      <MyList result={result} session={session} />
    </div>
  );
}
