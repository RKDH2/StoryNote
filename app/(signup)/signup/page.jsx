"use client";

import "../components/styles/signup.css";
import Link from "next/link";
import axios from "axios";
import { useRef, useState } from "react";

export default function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [realName, setRealName] = useState("");

  const [idMsg, setIdMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [realNameMsg, setRealNameMsg] = useState("");

  const [src, setSrc] = useState(""); // 이미지 업로드 보기
  const [previewSrc, setPreviewSrc] = useState(""); // 이미지 미리보기
  const [file, setFile] = useState(null); // 파일 상태
  const fileInputRef = useRef(null); // 파일 입력 필드 참조 추가

  const handleFileChange = (e) => {
    let selectedFile = e.target.files[0];

    // 파일 미리보기 URL 생성
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreviewSrc(previewUrl);
    setFile(selectedFile); // 파일 상태 설정
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (file) {
      let filename = encodeURIComponent(file.name);
      try {
        let res = await fetch("/api/forum/image?file=" + filename);
        let data = await res.json();

        // S3 업로드
        const formData = new FormData();
        Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
          formData.append(key, value);
        });
        let uploadResult = await fetch(data.url, {
          method: "POST",
          body: formData,
        });

        if (uploadResult.ok) {
          const imageUrl = data.url + "/" + data.fields.key;
          setSrc(
            `https://scriptpartyprofileimage.s3.ap-northeast-2.amazonaws.com/${data.imgSrc}`
          ); // 업로드된 파일의 URL 설정

          try {
            const response = await axios.post("/api/auth/register", {
              id,
              password,
              email,
              realName,
              profileImg: imageUrl,
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
        } else {
          console.log("업로드 실패");
        }
      } catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
      }
    } else {
      // 파일이 선택되지 않은 경우의 처리
      console.log("파일이 선택되지 않았습니다.");
    }
  };

  const handleRemoveImage = () => {
    setPreviewSrc("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          {idMsg && idMsg.length !== 0 ? <span>{idMsg}</span> : null}
        </div>
        <div>
          <p>비밀번호</p>
          <input
            name="password"
            type="password"
            placeholder="최소 6자 이상"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordMsg && passwordMsg.length !== 0 ? (
            <span>{passwordMsg}</span>
          ) : null}
        </div>
        <div>
          <p>이메일</p>
          <input
            name="email"
            type="text"
            placeholder="ex)scriptparty@gmail.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailMsg && emailMsg.length !== 0 ? <span>{emailMsg}</span> : null}
        </div>
        <div>
          <p>실명</p>
          <input
            name="realName"
            type="text"
            placeholder="ex)홍길동"
            required
            autoComplete="realName"
            value={realName}
            onChange={(e) => setRealName(e.target.value)}
          />
          {realNameMsg && realNameMsg.length !== 0 ? (
            <span>{realNameMsg}</span>
          ) : null}
        </div>
        <div className="container-profile-image">
          <label htmlFor="file">
            <div className="btn-profile-upload">이미지 업로드하기</div>
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            name="imgSrc"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {previewSrc && (
            <>
              <img src={previewSrc} className="profile-image-preview" />
              <button
                className="img-delete-btn"
                type="button"
                onClick={handleRemoveImage}
              >
                이미지 삭제
              </button>
            </>
          )}
        </div>
        <button className="register-btn" type="submit">
          회원가입
        </button>
      </form>
    </div>
  );
}
