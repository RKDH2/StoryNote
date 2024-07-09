"use client";

import Link from "next/link";
import "../components/styles/signup.css";
import axios from "axios";
import { useState } from "react";

export default function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [idMsg, setIdMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [realNameMsg, setRealNameMsg] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/register", {
        id: id,
        password: password,
        email: email,
      });

      if (response.status === 200) {
        alert("회원가입 성공");
        window.location.href = "/";
      }
    } catch (error) {
      console.log("회원가입 에러");
      console.log(error);
      if (error.response.data.errors) {
        setIdMsg(error.response.data.errors.id);
        setPasswordMsg(error.response.data.errors.password);
        setEmailMsg(error.response.data.errors.email);
        setRealNameMsg(error.response.data.errors.realName);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignUp}>
        <Link href="/" className="signup-logo-img">
          <img src="/ScriptPartyLogo.svg" />
        </Link>
        <div>
          <p>아이디</p>
          <input
            name="id"
            type="text"
            placeholder="4~15자 이내로 입력해주세요"
            required
            autoComplete="username"
            onChange={(e) => setId(e.target.value)}
          />
          {idMsg.length !== 0 ? <span>{idMsg}</span> : null}
        </div>
        <div>
          <p>비밀번호</p>
          <input
            name="password"
            type="password"
            placeholder="최소 6자 이상"
            required
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordMsg.length !== 0 ? <span>{passwordMsg}</span> : null}
        </div>
        <div>
          <p>이메일</p>
          <input
            name="email"
            type="text"
            placeholder="ex)scriptparty@gmail.com"
            required
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailMsg.length !== 0 ? <span>{emailMsg}</span> : null}
        </div>
        <div>
          <p>실명</p>
          <input
            name="realName"
            type="text"
            placeholder="ex)홍길동"
            required
            autoComplete="realName"
            onChange={(e) => setRealNameMsg(e.target.value)}
          />
          {realNameMsg.length !== 0 ? <span>{realNameMsg}</span> : null}
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
