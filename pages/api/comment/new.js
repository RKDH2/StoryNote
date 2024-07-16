import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "세션확인안됨" });
    }

    const getCurrentTime = () => new Date();

    if (req.method === "POST") {
      const { comment, _id } = req.body;

      if (!comment || comment.trim() === "") {
        return res.status(400).json({ message: "댓글입력안함" });
      }

      let saveComment = {
        comment: comment,
        parent: new ObjectId(_id),
        author_name: session.user.name,
        author_profile: session.user.image,
        author_email: session.user.email,
        author_post_time: getCurrentTime(),
      };

      console.log(saveComment);

      let db = (await connectDB).db("forum");
      let result = await db.collection("comment").insertOne(saveComment);
      console.log("결과", result);
      res.status(200).json(result);
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("서버 에러:", error); // 에러 로그 추가
    return res.status(500).json({ message: "서버에러" });
  }
}
