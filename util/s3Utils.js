const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const generatePresignedUrl = (bucketName, objectKey) => {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 60, // URL의 유효 기간 (초 단위)
  };

  return s3.getSignedUrl("getObject", params);
};

module.exports = { generatePresignedUrl };
