const aws = require("aws-sdk");

//* S3 이미지 서버 연결
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const s3 = new aws.S3();

console.log("resource server connected");