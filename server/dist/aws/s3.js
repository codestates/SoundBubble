"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.s3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const log_1 = require("../utils/log");
//* aws config
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
exports.s3 = new aws_sdk_1.default.S3();
const deleteResource = async (bucket, filename) => {
    exports.s3.deleteObject({
        Bucket: bucket,
        Key: filename,
    }, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function (error, data) {
        if (error) {
            log_1.logError("S3 리소스 삭제 실패");
            console.error(error);
        }
    });
};
exports.deleteResource = deleteResource;
