import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import MyList from "../components/MyList";

export const dynamic = "force-dynamic";

export default async function MyPostList() {
  try {
    const db = (await connectDB).db("forum");

    // 세션 가져오기
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("세션이 없거나 사용자 정보가 없습니다.");
    }

    const email = session.user.email;

    const testdb = (await connectDB).db("test");
    const users = await testdb.collection("users").findOne({ email });

    if (!users) {
      throw new Error("해당 이메일을 가진 사용자를 찾을 수 없습니다.");
    }

    const userId = users._id.toString();

    let result = await db
      .collection("community_post")
      .find({ post_id: userId })
      .sort({ post_time: -1 })
      .toArray();

    result = result.map((a) => {
      a._id = a._id.toString();
      return a;
    });

    return (
      <div className="list-background">
        <MyList result={result} session={session} />
      </div>
    );
  } catch (error) {
    console.error("오류 발생:", error.message);
    // 오류가 발생한 경우 빈 배열을 반환하여 처리
    return (
      <div className="list-background">
        <MyList result={[]} />
      </div>
    );
  }
}
