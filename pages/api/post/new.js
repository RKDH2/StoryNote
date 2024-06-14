import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);
  // console.log(session);
  if (session) {
    const getCurrentTime = () => {
      return new Date();
    };

    try {
      let body = req.body;

      if (typeof req.body === "string") {
        body = JSON.parse(req.body);
      }

      req.body.author = session.user.email; // 이메일 정보
      req.body.author_name = session.user.name; // 유저 이름
      req.body.post_time = getCurrentTime();

      req.body = JSON.stringify(body);
    } catch (error) {
      console.log("잘못된 JSON이 있습니다.");
    }
  }
  // console.log(req.body); // 저장된 내용
  if (req.method == "POST") {
    if (req.body.title == "") {
      return res.status(400).json("제목입력안함");
    } else if (req.body.content == "") {
      return res.status(400).json("내용입력안함");
    }
    try {
      const db = (await connectDB).db("forum");
      await db.collection("post").insertOne(JSON.parse(req.body));
      res.status(200).redirect("/list");
    } catch {
      res.status(500).json({ error: "DB오류" });
    }
  }
}
