import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);
  console.log(session);
  if (session) {
    req.body.author = session.user.email; // 이메일 정보
    req.body.author_name = session.user.name; // 유저 이름
  }
  console.log(req.body); // 저장된 내용
  if (req.method == "POST") {
    if (req.body.title == "") {
      return res.status(200).json("제목입력안함");
    } else if (req.body.content == "") {
      return res.status(200).json("내용입력안함");
    }
    try {
      const db = (await connectDB).db("forum");
      await db.collection("post").insertOne(req.body);
      res.status(200).redirect("/list");
    } catch {
      res.status(200).redirect("DB오류");
    }
  }
}
