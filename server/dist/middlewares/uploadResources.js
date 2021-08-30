"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3_1 = require("../aws/s3");
const error_1 = require("../error");
const supportedExt = ["wav", "webm", "jpg", "jpeg", "png"];
const upload = multer_1.default({
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    storage: multer_s3_1.default({
        s3: s3_1.s3,
        bucket: "soundbubble-resource",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: function (req, file, callback) {
            console.log("파일 업로드", file.originalname);
            //* 파일 이름에서 확장자 추출
            const originalFileName = file.originalname.split(".");
            let ext;
            if (originalFileName.length >= 2) {
                ext = originalFileName.pop()?.toLowerCase();
            }
            else {
                ext = "";
            }
            // MIME type에서 확장자 추출
            const mimeTypeExt = file.mimetype.split("/").pop()?.toLowerCase();
            if (!supportedExt.includes(ext) && !supportedExt.includes(mimeTypeExt)) {
                // 지원하지 않는 파일
                const errMessage = `Invalid File Type.\nsupported extensions: ${supportedExt.join(" ")}.\ninput file(FormData) extension: ${ext}, MIME type: ${file.mimetype}`;
                return callback(new error_1.FileTypeError(errMessage));
            }
            //* S3에 저장할 파일 이름 생성 및 경로 설정
            if (ext === "")
                ext = mimeTypeExt;
            const s3FileName = Date.now() + "." + ext;
            let s3FilePath;
            if (file.mimetype.includes("audio")) {
                s3FilePath = "sound/" + s3FileName;
            }
            else {
                s3FilePath = "original/" + s3FileName;
            }
            // S3에 저장
            callback(null, s3FilePath);
        },
    }),
});
exports.default = upload;
