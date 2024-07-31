import fetch from "node-fetch";
import { getSession } from "next-auth/react";
import { URL } from "url";

// 허용된 도메인 목록
const ALLOWED_DOMAINS = [`${process.env.AWS_IMG_URL}`]; // 실제 도메인만 포함

// 이미지 파일 확장자 필터링
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

export default async function handler(req, res) {
  const { url } = req.query;
  const session = await getSession({ req });

  // 사용자 인증 검사
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // URL 검증
  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    // URL을 파싱하고 검증
    const parsedUrl = new URL(url);

    // 허용된 도메인만 처리
    if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
      return res.status(403).json({ error: "Forbidden domain" });
    }

    // 파일 확장자 검증
    const fileExtension = parsedUrl.pathname.split(".").pop();
    if (!ALLOWED_EXTENSIONS.includes(`.${fileExtension}`)) {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // 민감한 정보가 포함된 URL 필터링
    parsedUrl.searchParams.delete("sensitiveParam");

    // URL 요청 및 응답 처리
    const response = await fetch(parsedUrl.toString());
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch image" });
    }
    const buffer = await response.buffer();

    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.send(buffer);
  } catch (error) {
    // 상세한 에러 메시지 로그와 일반적인 사용자 메시지 구분
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
}
