import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);

  console.log(req.body);
  if (req.method == "POST") {
    try {
      let change = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        post_time: req.body.post_time,
      };
      if (req.body.title == "" || req.body.content == "") {
        return res.status(200).json("제목 또는 내용이 비어있습니다.");
      }
      const db = (await connectDB).db("forum");
      try {
        await db
          .collection("post")
          .updateOne({ _id: new ObjectId(req.body.id) }, { $set: change });
        console.log("완료", req.body);
        res.status(200).redirect("/mylist");
      } catch {
        res.status(405).json({ message: "DB Error" });
      }
    } catch {
      res.status(405).json({ message: "Method not allowed" });
    }
  }
}
