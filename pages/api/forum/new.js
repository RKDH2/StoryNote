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
      let body = req.body;

      // JSON 데이터 파싱
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

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
      } else {
        // JWT 사용자 (회원가입)
        const email = session.user.email; // JWT 사용자의 경우도 이메일 정보를 얻어올 수 있어야 함
        db = (await connectDB).db("signup");
        users = await db.collection("user_cred").findOne({ email });

        if (!users) {
          throw new Error("해당 이메일을 가진 사용자를 찾을 수 없습니다.");
        }

        req.body.profile_img = users.profileImg;
        req.body.author_name = session.user.id; // 유저 이름
      }

      req.body.post_id = users._id;
      req.body.author = session.user.email; // 이메일 정보
      req.body.post_time = getCurrentTime();

      // console.log(req.body); // 저장된 내용
      if (req.method == "POST") {
        if (req.body.title == "") {
          return res.status(400).json("제목입력안함");
        } else if (req.body.content == "") {
          return res.status(400).json("내용입력안함");
        }
        try {
          const db = (await connectDB).db("forum");
          await db.collection("community_post").insertOne(JSON.parse(req.body));
          res.status(200).redirect("/community");
        } catch {
          res.status(500).json({ error: "DB오류" });
        }
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
