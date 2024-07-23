import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method == "DELETE") {
    try {
      let session = await getServerSession(req, res, authOptions);

      const email = session.user.email;
      const testdb = (await connectDB).db("test");
      const users = await testdb.collection("users").findOne({ email: email });
      console.log("User:", users);

      if (!session) {
        res.status(401).json("로그인이 필요합니다");
      }

      console.log("글의 아이디 값:", req.body); // 글 id 값 호출

      const postId = req.body;

      if (!postId) {
        return res.status(400).json({ error: "게시물 ID가 필요합니다" });
      }

      const db = (await connectDB).db("forum");
      let find = await db
        .collection("community_post")
        .findOne({ _id: new ObjectId(postId) });
      console.log(find.post_id); // 글의 포스트 id값 호출

      if (!find) {
        res.status(404).json("게시물을 찾을 수 없습니다");
      }

      if (find.post_id.equals(users._id)) {
        await db
          .collection("comment")
          .deleteMany({ parent: new ObjectId(postId) });
        await db
          .collection("community_post")
          .deleteOne({ _id: new ObjectId(req.body) });
        res.status(200).json("삭제완료");
      } else {
        res.status(403).json("글을 작성한 유저가 아닙니다!(불일치)");
      }
    } catch (error) {
      console.log("통신 오류");
      res.status(500).json("DB 또는 서버오류 발생");
    }
  } else {
    res.status(405).json("허용되지 않은 요청입니다.");
  }
}
