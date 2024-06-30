import { connectDB } from "@/util/database";
import bcrypt from "bcrypt"; // 암호화 라이브러리

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, email, password } = req.body;

    // 입력 값 검증
    if (!id.trim() || !email.trim() || !password.trim()) {
      return res
        .status(400)
        .json({ error: "이름, 이메일, 비밀번호는 필수 입력 항목입니다." });
    }
    // 이름, 이메일, 비밀번호의 길이가 각각 30글자를 넘지 않는지 확인
    if (
      id.length > 15 ||
      email.length > 30 ||
      // password.length > 30 ||
      id.length < 4 ||
      password.length < 6
    ) {
      let errors = {};
      if (id.length > 15) {
        errors.id = "이름은 15글자를 넘을 수 없습니다.";
      }
      if (id.length < 4) {
        errors.id = "이름은 4글자보다 짧을 수 없습니다.";
      }
      if (email.length > 30) {
        errors.email = "이메일은 30글자를 넘을 수 없습니다.";
      }
      // if (password.length > 30) {
      //   errors.password = "비밀번호는 30글자를 넘을 수 없습니다.";
      // }
      if (password.length < 6) {
        errors.password = "비밀번호는 6글자보다 짧을 수 없습니다.";
      }

      // 이메일 유효성 검사 (예시: 간단한 형식 확인)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "올바른 이메일 주소를 입력하세요.";
      }

      return res.status(400).json({ errors });
    }

    let db = (await connectDB).db("forum");
    const existingUser = await db.collection("user_cred").findOne({ email });
    const passwordUser = await db.collection("user_cred").findOne({ password });
    const idUser = await db.collection("user_cred").findOne({ id });

    if (existingUser && passwordUser && idUser) {
      return res.status(400).json({ error: "이미 사용 중인 이메일입니다." });
    }

    let hash = await bcrypt.hash(req.body.password, 10);
    // console.log(hash);
    // console.log(req.body);
    req.body.password = hash;

    await db.collection("user_cred").insertOne(req.body);
    res.status(200).redirect(process.env.NEXTAUTH_URL);
  }
}
