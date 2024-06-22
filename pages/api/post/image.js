import aws from "aws-sdk";
export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    region: "ap-northeast-2",
    signatureVersion: "v4",
  });

  const s3 = new aws.S3();
  const url = await s3.createPresignedPost({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Fields: { key: req.query.file },
    Expires: 60, // seconds
    Conditions: [
      ["content-length-range", 0, 4194304], //파일용량 1MB(1048576) 까지 제한 (현재 설정 4MB)
    ],
  });

  res.status(200).json(url);
}
