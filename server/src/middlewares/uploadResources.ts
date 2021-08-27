import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../aws/s3";
import { FileTypeError } from "../error";

const supportedExt: string[] = ["wav", "webm", "jpg", "jpeg", "png"];

const upload: multer.Multer = multer({
	storage: multerS3({
		s3: s3,
		bucket: "soundbubble-resource",
		contentType: multerS3.AUTO_CONTENT_TYPE,
		acl: "public-read",
		key: function (req: Express.Request, file: Express.Multer.File, callback) {
			console.log("파일 업로드", file.originalname);

			//* 파일 이름에서 확장자 추출
			const originalFileName: string[] = file.originalname.split(".");
			let ext: string;
			if (originalFileName.length >= 2) {
				ext = originalFileName.pop()?.toLowerCase() as string;
			} else {
				ext = "";
			}

			// MIME type에서 확장자 추출
			const mimeTypeExt: string = file.mimetype.split("/").pop()?.toLowerCase() as string;
			if (!supportedExt.includes(ext) && !supportedExt.includes(mimeTypeExt)) {
				// 지원하지 않는 파일
				const errMessage = `Invalid File Type.\nsupported extensions: ${supportedExt.join(" ")}.\ninput file(FormData) extension: ${ext}, MIME type: ${file.mimetype}`;
				return callback(new FileTypeError(errMessage));
			}

			//* S3에 저장할 파일 이름 생성 및 경로 설정
			if (ext === "") ext = mimeTypeExt;
			const s3FileName: string = Date.now() + "." + ext;
			let s3FilePath: string;
			if (file.mimetype.includes("audio")) {
				s3FilePath = "sound/" + s3FileName;
			} else {
				s3FilePath = "original/" + s3FileName;
			}
			// S3에 저장
			callback(null, s3FilePath);
		},
	}),
});

export default upload;
