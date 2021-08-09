"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const aws = require("aws-sdk");
//* S3 이미지 서버 연결
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
exports.s3 = new aws.S3();
console.log("resource server connected");
//# sourceMappingURL=s3.js.map