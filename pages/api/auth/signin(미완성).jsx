"use client";

import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn({ providers }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [blankPw, setBlankPw] = useState(false);
  const router = useRouter();

  return (
    <div>
      <form method="POST" action="/api/auth/signup">
        <input name="name" type="text" placeholder="아이디" required />
        <input name="email" type="text" placeholder="이메일" required />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
