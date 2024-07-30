import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    // 주어진 URL로 이미지를 요청합니다.
    const response = await fetch(url);

    // 응답에서 이미지 데이터를 버퍼로 읽어옵니다.
    const buffer = await response.buffer();

    // 원본 응답의 Content-Type 헤더를 설정하여 브라우저가 적절한 파일 형식으로 인식하도록 합니다.
    res.setHeader("Content-Type", response.headers.get("Content-Type"));

    // 이미지 버퍼 데이터를 클라이언트로 전송합니다.
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
}
