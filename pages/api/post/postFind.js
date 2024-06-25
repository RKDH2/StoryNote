import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const db = (await connectDB).db("forum");
      const posts = await db
        .collection("post")
        .find()
        .sort({ post_time: -1 })
        .toArray();

      // 작성자 정보를 포함하여 응답하기
      const postsWithUser = await Promise.all(
        posts.map(async (post) => {
          await db
            .collection("users")
            .findOne({ _id: new ObjectId(post.userId) });
          return post;
        })
      );

      res.status(200).json(postsWithUser);
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
