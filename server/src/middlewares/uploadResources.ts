import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../aws/s3";

const extensions: string[] = ["wav", "jpg", "jpeg", "png"];

const upload: multer.Multer = multer({
  storage: multerS3({
    s3: s3,
    bucket: "soundbubble-resource/resource",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: function (req: Express.Request, file: Express.Multer.File, callback) {
      let extenstion: string = file.originalname.split(".").pop()?.toLowerCase() as string;
      if (!extensions.includes(extenstion)) extenstion = "wav";
      callback(null, Date.now() + "." + extenstion);
    },
  }),
});

export default upload;
