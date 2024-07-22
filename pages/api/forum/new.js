import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    let session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res
        .status(401)
        .json({ error: "세션이 없거나 인증되지 않았습니다." });
    }

    console.log("테스트:", session);

    const getCurrentTime = () => new Date();

    try {
      let body;
      if (typeof req.body === "string") {
        try {
          body = JSON.parse(req.body);
        } catch (error) {
          console.error("JSON 파싱 오류:", error.message);
          return res.status(400).json({ error: "잘못된 JSON 형식입니다." });
        }
      } else {
        body = req.body;
      }

      let db;
      let users;

      if (session.user.email) {
        // 소셜 로그인 사용자
        const email = session.user.email;
        db = (await connectDB).db("test");
        users = await db.collection("users").findOne({ email });

        if (!users) {
          throw new Error("해당 이메일을 가진 사용자를 찾을 수 없습니다.");
        }

        req.body.profile_img = users.image;
        req.body.author_name = session.user.name; // 유저 이름
      }

      body.post_id = users._id;
      body.author = session.user.email; // 이메일 정보
      body.post_time = getCurrentTime();

      if (req.method == "POST") {
        if (body.title == "") {
          return res.status(400).json("제목입력안함");
        } else if (body.content == "") {
          return res.status(400).json("내용입력안함");
        }

        try {
          const db = (await connectDB).db("forum");
          await db.collection("community_post").insertOne(body);
          return res
            .status(200)
            .json({ success: true, redirectUrl: "/community" });
        } catch {
          console.error("DB 오류:", dbError.message);
          res.status(500).json({ error: "DB오류" });
        }
      } else {
        return res.status(405).json({ error: "허용되지 않은 메서드입니다." });
      }
    } catch (error) {
      console.error("오류 발생:", error.message);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error("오류 발생:", error.message);
    res.status(500).json({ error: "서버 오류 발생" });
  }
}
