import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);

  const email = session.user.email;
  const testdb = (await connectDB).db("test");
  const users = await testdb.collection("users").findOne({ email: email });
  console.log("User:", users);

  console.log(req.body);

  if (req.method == "POST") {
    try {
      let change = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        imgSrc: req.body.imgSrc,
        post_time: req.body.post_time,
      };
      if (req.body.title == "" || req.body.content == "") {
        return res.status(200).json("제목 또는 내용이 비어있습니다.");
      }
      const db = (await connectDB).db("forum");

      let find = await db
        .collection("community_post")
        .findOne({ _id: new ObjectId(req.body.id) });

      try {
        if (find.post_id == users._id) {
          await db
            .collection("community_post")
            .updateOne({ _id: new ObjectId(req.body.id) }, { $set: change });
          console.log("완료", req.body);
          res.status(200).redirect("/mylist");
        } else {
          res.status(403).json("글을 작성한 유저가 아닙니다!(불일치)");
        }
      } catch {
        res.status(405).json({ message: "DB Error" });
      }
    } catch {
      res.status(405).json({ message: "Method not allowed" });
    }
  }
}
