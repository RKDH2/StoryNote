import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const email = session.user.email;
  const testdb = (await connectDB).db("test");
  const users = await testdb.collection("users").findOne({ email: email });

  if (!users) {
    return res.status(404).json({ message: "User not found" });
  }

  console.log("User:", users);
  console.log(req.body);

  if (req.method == "POST") {
    try {
      if (req.body.title == "" || req.body.content == "") {
        return res.status(200).json("제목 또는 내용이 비어있습니다.");
      }

      const db = (await connectDB).db("forum");

      let find = await db
        .collection("community_post")
        .findOne({ _id: new ObjectId(req.body.id) });

      if (!find) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (find.post_id.toString() !== users._id.toString()) {
        return res
          .status(403)
          .json({ message: "글을 작성한 유저가 아닙니다!(불일치)" });
      }

      let change = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        imgSrc: req.body.imgSrc,
        post_time: req.body.post_time,
      };

      await db
        .collection("community_post")
        .updateOne({ _id: new ObjectId(req.body.id) }, { $set: change });

      console.log("완료", req.body);
      return res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
      console.error("Server Error", error);
      return res.status(500).json({ message: "Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
